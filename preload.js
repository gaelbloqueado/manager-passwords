// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // PIN
    verifyPin: (pin) => ipcRenderer.invoke('verify-pin', pin),

    // Passwords CRUD
    getPasswords: () => ipcRenderer.invoke('get-passwords'),
    addPassword: (data) => ipcRenderer.invoke('add-password', data),
    updatePassword: (data) => ipcRenderer.invoke('update-password', data),
    deletePassword: (id) => ipcRenderer.invoke('delete-password', id),

    // Password Generator
    generatePassword: (length, options) => ipcRenderer.invoke('generate-password', length, options),

    // Clipboard
    copyToClipboard: (text) => ipcRenderer.send('copy-to-clipboard', text),

    // External Links
    openExternalLink: (url) => ipcRenderer.send('open-external-link', url),

    // Listeners
    onTriggerNewEntry: (callback) => ipcRenderer.on('trigger-new-entry', callback),
    handleError: (callback) => ipcRenderer.on('main-process-error', (_event, errorDetails) => callback(errorDetails)),
});

ipcRenderer.on('copy-to-clipboard', (event, text) => {
    if (text) {
        navigator.clipboard.writeText(text)
            .then(() => console.log('Texto copiado al portapapeles'))
            .catch(err => console.error('Error al copiar texto: ', err));
    }
});
