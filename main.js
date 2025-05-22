// main.js
const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const fs = require('fs');

// --- Configuración de Seguridad ---
const FIXED_PIN = '0000';
const SALT = 'una_sal_muy_secreta_deberia_ser_aleatoria_y_unica_por_usuario'; // En una app real, esta sal debería ser generada aleatoriamente y almacenada de forma segura.
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // Para AES, esto es siempre 16

let db;
let mainWindow;
let pinWindow;

function deriveKey(pin, salt) {
    return crypto.scryptSync(pin, salt, 32); // 32 bytes = 256 bits
}

const encryptionKey = deriveKey(FIXED_PIN, SALT);

function encrypt(text) {
    if (text === null || typeof text === 'undefined') {
        return null;
    }
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(encryptionKey), iv);
    let encrypted = cipher.update(text.toString(), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
    if (text === null || typeof text === 'undefined') {
        return null;
    }
    try {
        const parts = text.split(':');
        if (parts.length !== 2) {
            console.error("Formato de texto cifrado inválido. No se puede dividir en IV y texto.");
            return `Error: Formato inválido (partes ${parts.length})`;
        }
        const iv = Buffer.from(parts.shift(), 'hex');
        const encryptedText = Buffer.from(parts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(encryptionKey), iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Error al descifrar:", error);
        // Podrías devolver un mensaje de error específico o relanzar el error
        // dependiendo de cómo quieras manejarlo en la UI
        return `Error al descifrar: ${error.message}`;
    }
}


// --- Configuración de la Base de Datos ---
function setupDatabase() {
    const dbDir = path.join(app.getPath('userData'), 'database');
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
    const dbPath = path.join(dbDir, 'passwords.db');
    db = new Database(dbPath, { verbose: console.log }); // verbose para depuración

    // Crear tabla si no existe
    db.exec(`
        CREATE TABLE IF NOT EXISTS passwords (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            site_name TEXT NOT NULL,
            username TEXT NOT NULL,
            encrypted_password TEXT NOT NULL,
            notes TEXT,
            category TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Trigger para actualizar 'updated_at'
    db.exec(`
        CREATE TRIGGER IF NOT EXISTS update_password_updated_at
        AFTER UPDATE ON passwords
        FOR EACH ROW
        BEGIN
            UPDATE passwords SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
        END;
    `);
}

// --- Creación de Ventanas ---
function createPinWindow() {
    pinWindow = new BrowserWindow({
        width: 450, 
        height: 500, 
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        resizable: false, 
        maximizable: false,
        fullscreenable: false,
        autoHideMenuBar: true,
        frame: false, 
        transparent: true, 
        alwaysOnTop: true, 
    });
    pinWindow.loadFile(path.join(__dirname, 'src/index.html'));
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        show: false, // No mostrar hasta que esté lista
        autoHideMenuBar: true,
    });
    mainWindow.loadFile(path.join(__dirname, 'src/app.html'));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
}

// --- Eventos de la Aplicación ---
app.whenReady().then(() => {
    setupDatabase();
    createPinWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createPinWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    if (db) {
        db.close();
    }
});

// Verificación de PIN
ipcMain.handle('verify-pin', (event, pin) => {
    if (pin === FIXED_PIN) {
        if (pinWindow) {
            pinWindow.close();
            pinWindow = null;
        }
        createMainWindow();
        return { success: true };
    } else {
        return { success: false, message: 'PIN incorrecto.' };
    }
});

// Obtener todas las contraseñas
ipcMain.handle('get-passwords', async () => {
    try {
        const stmt = db.prepare('SELECT * FROM passwords ORDER BY site_name COLLATE NOCASE ASC');
        const rawPasswords = stmt.all();
        return rawPasswords.map(p => ({
            ...p,
            password: decrypt(p.encrypted_password)
        }));
    } catch (error) {
        console.error('Error al obtener contraseñas:', error);
        return { error: error.message };
    }
});

// Agregar nueva contraseña
ipcMain.handle('add-password', async (event, data) => {
    try {
        const { site_name, username, password, notes, category } = data;
        if (!site_name || !username || !password) {
            return { success: false, message: 'Sitio, Usuario y Contraseña son obligatorios.' };
        }
        const encryptedPassword = encrypt(password);
        const stmt = db.prepare('INSERT INTO passwords (site_name, username, encrypted_password, notes, category) VALUES (?, ?, ?, ?, ?)');
        const info = stmt.run(site_name, username, encryptedPassword, notes, category);
        return { success: true, id: info.lastInsertRowid };
    } catch (error) {
        console.error('Error al agregar contraseña:', error);
        return { success: false, message: error.message };
    }
});

// Actualizar contraseña
ipcMain.handle('update-password', async (event, data) => {
    try {
        const { id, site_name, username, password, notes, category } = data;
        const encryptedPassword = encrypt(password);
        const stmt = db.prepare('UPDATE passwords SET site_name = ?, username = ?, encrypted_password = ?, notes = ?, category = ? WHERE id = ?');
        const info = stmt.run(site_name, username, encryptedPassword, notes, category, id);
        return { success: info.changes > 0 };
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        return { success: false, message: error.message };
    }
});

// Eliminar contraseña
ipcMain.handle('delete-password', async (event, id) => {
    try {
        const stmt = db.prepare('DELETE FROM passwords WHERE id = ?');
        const info = stmt.run(id);
        return { success: info.changes > 0 };
    } catch (error) {
        console.error('Error al eliminar contraseña:', error);
        return { success: false, message: error.message };
    }
});

// Generar contraseña segura
ipcMain.handle('generate-password', (event, length = 16, options = {}) => {
    const { useUppercase = true, useLowercase = true, useNumbers = true, useSymbols = true } = options;
    let charset = "";
    if (useUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (useNumbers) charset += "0123456789";
    if (useSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (charset === "") {
        return { error: "Debe seleccionar al menos un tipo de caracter." };
    }

    let password = "";
    const randomValues = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        password += charset[randomValues[i] % charset.length];
    }
    return { password };
});

// Abrir enlaces externos
ipcMain.on('open-external-link', (event, url) => {
    shell.openExternal(url);
});


// Menú básico
const menuTemplate = [
    {
        label: 'Archivo',
        submenu: [
            {
                label: 'Nueva Entrada',
                accelerator: 'CmdOrCtrl+N',
                click: () => {
                    if (mainWindow) {
                        mainWindow.webContents.send('trigger-new-entry');
                    }
                }
            },
            { type: 'separator' },
            { role: 'quit', label: 'Salir' }
        ]
    },
    {
        label: 'Editar',
        submenu: [
            { role: 'undo', label: 'Deshacer' },
            { role: 'redo', label: 'Rehacer' },
            { type: 'separator' },
            { role: 'cut', label: 'Cortar' },
            { role: 'copy', label: 'Copiar' },
            { role: 'paste', label: 'Pegar' },
            { role: 'selectAll', label: 'Seleccionar Todo' }
        ]
    },
    {
        label: 'Ayuda',
        submenu: [
            {
                label: 'Acerca de',
                click: async () => {
                    shell.openExternal('https://github.com/gaelbloqueado'); 
                }
            },
            {
                label: 'Abrir Herramientas de Desarrollo',
                accelerator: 'CmdOrCtrl+Shift+I',
                click: () => {
                    if (mainWindow) mainWindow.webContents.openDevTools();
                    if (pinWindow) pinWindow.webContents.openDevTools();
                }
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);
