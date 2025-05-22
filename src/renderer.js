// renderer.js

// --- Lógica para la pantalla de PIN (index.html) ---
if (document.getElementById('pinForm')) {
    const pinForm = document.getElementById('pinForm');
    const pinInput = document.getElementById('pinInput');
    const pinMessage = document.getElementById('pinMessage');

    pinInput.focus();

    pinForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const pin = pinInput.value;
        const result = await window.electronAPI.verifyPin(pin);
        if (result.success) {
            // El main.js se encarga de cerrar esta ventana y abrir la principal
        } else {
            pinMessage.textContent = result.message || 'PIN incorrecto.';
            pinInput.value = '';
            pinInput.focus();
            const pinContainer = document.querySelector('.pin-container');
            if (pinContainer) {
                pinContainer.classList.add('animate-shake');
                setTimeout(() => pinContainer.classList.remove('animate-shake'), 500);
            }
        }
    });
}

// --- Lógica para la pantalla principal de la aplicación (app.html) ---
if (document.getElementById('passwordListContainer')) {
    // DOM Elements
    const passwordListContainerEl = document.getElementById('passwordListContainer');
    const searchInput = document.getElementById('searchInput');
    const addPasswordBtn = document.getElementById('addPasswordBtn');
    const generatePasswordSidebarBtn = document.getElementById('generatePasswordSidebarBtn');

    const emptyStateEl = document.getElementById('emptyState');
    const detailsViewEl = document.getElementById('detailsView');
    const detailsSiteNameEl = document.getElementById('detailsSiteName');
    const detailsCategoryTagEl = document.getElementById('detailsCategoryTag');
    const detailsCategoryTextEl = document.getElementById('detailsCategoryText');
    const detailsUsernameEl = document.getElementById('detailsUsername');
    const detailsPasswordEl = document.getElementById('detailsPassword');
    const detailsNotesEl = document.getElementById('detailsNotes');
    const detailsCreatedAtEl = document.getElementById('detailsCreatedAt');
    const detailsUpdatedAtEl = document.getElementById('detailsUpdatedAt');

    const copyUsernameBtn = document.getElementById('copyUsernameBtn');
    const copyPasswordBtn = document.getElementById('copyPasswordBtn');
    const togglePasswordVisibilityBtn = document.getElementById('togglePasswordVisibilityBtn');
    const editPasswordBtn = document.getElementById('editPasswordBtn');
    const deletePasswordBtn = document.getElementById('deletePasswordBtn');

    const passwordModal = document.getElementById('passwordModal');
    const modalTitle = document.getElementById('modalTitle');
    const passwordForm = document.getElementById('passwordForm');
    const passwordIdInput = document.getElementById('passwordId');
    const siteNameInput = document.getElementById('siteNameInput');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInputModal = document.getElementById('passwordInput');
    const categorySelectEl = document.getElementById('categorySelect');
    const notesInput = document.getElementById('notesInput');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const saveModalBtn = document.getElementById('saveModalBtn');
    const generateInModalBtn = document.getElementById('generateInModalBtn');

    const generatorModal = document.getElementById('generatorModal');
    const generatedPasswordOutput = document.getElementById('generatedPasswordOutput');
    const copyGeneratedPasswordBtn = document.getElementById('copyGeneratedPasswordBtn');
    const passwordLengthInput = document.getElementById('passwordLengthInput');
    const passwordLengthValue = document.getElementById('passwordLengthValue');
    const uppercaseCb = document.getElementById('uppercaseCb');
    const lowercaseCb = document.getElementById('lowercaseCb');
    const numbersCb = document.getElementById('numbersCb');
    const symbolsCb = document.getElementById('symbolsCb');
    const regeneratePasswordBtn = document.getElementById('regeneratePasswordBtn');
    const cancelGeneratorModalBtn = document.getElementById('cancelGeneratorModalBtn');
    const useGeneratedPasswordBtn = document.getElementById('useGeneratedPasswordBtn');

    const toastNotificationEl = document.getElementById('toastNotification');
    const toastMessageEl = document.getElementById('toastMessage');

    // Sidebar Header & Settings Panel
    const toggleSettingsBtn = document.getElementById('toggleSettingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const themeSelector = document.getElementById('themeSelector');
    const languageSelector = document.getElementById('languageSelector');

    let allPasswords = [];
    let selectedPasswordId = null;
    let currentPasswordForGeneratorModal = null;

    const predefinedCategories = ["Juegos", "Redes Sociales", "Personal", "Pagina Web", "Otros"];

    // --- Translations ---
    const translations = {
        es: {
            appTitle: "Mi Gestor de Contraseñas",
            passwordsMainTitle: "Contraseñas",
            addPasswordBtnTitle: "Añadir nueva contraseña",
            searchPlaceholder: "Buscar...",
            generatePasswordBtn: "Generador",
            settingsTitle: "Ajustes",
            toggleSettingsTitle: "Mostrar/Ocultar Ajustes",
            themeLabel: "Tema:",
            themeDark: "Oscuro",
            themeRed: "Rojo",
            themeBlue: "Azul",
            languageLabel: "Idioma:",
            emptyStateTitle: "Selecciona o crea una entrada",
            emptyStateSubtitle: "Tus detalles de contraseña aparecerán aquí.",
            editBtnTitle: "Editar",
            deleteBtnTitle: "Eliminar",
            usernameLabel: "Usuario:",
            passwordLabel: "Contraseña:",
            togglePasswordVisibilityBtnTitle: "Mostrar/Ocultar contraseña",
            copyUsernameBtnTitle: "Copiar usuario",
            copyPasswordBtnTitle: "Copiar contraseña",
            categoryLabel: "Categoría:",
            notesLabel: "Notas:",
            createdLabel: "Creado:",
            modifiedLabel: "Modificado:",
            addPasswordModalTitle: "Añadir Nueva Contraseña",
            editPasswordModalTitle: "Editar Contraseña",
            siteNameModalLabel: "Nombre del Sitio/App:",
            usernameModalLabel: "Usuario/Email:",
            passwordModalLabel: "Contraseña:",
            generateBtnTitle: "Generar contraseña",
            strengthLabel: "Fortaleza:",
            strengthWeak: "Débil",
            strengthMedium: "Media",
            strengthStrong: "Fuerte",
            categoryModalLabel: "Categoría:",
            categorySelectDefault: "-- Seleccionar --",
            categoryGames: "Juegos",
            categorySocial: "Redes Sociales",
            categoryPersonal: "Personal",
            categoryWebsite: "Página Web",
            categoryOther: "Otros",
            notesModalLabel: "Notas (opcional):",
            cancelBtn: "Cancelar",
            saveBtn: "Guardar",
            passwordGeneratorTitle: "Generador de Contraseñas",
            generatedPasswordLabel: "Contraseña Generada:",
            copyGeneratedPasswordBtnTitle: "Copiar contraseña generada",
            lengthLabel: "Longitud:",
            uppercaseLabel: "Mayúsculas (A-Z)",
            lowercaseLabel: "Minúsculas (a-z)",
            numbersLabel: "Números (0-9)",
            symbolsLabel: "Símbolos (!@#...)",
            regenerateBtn: "Regenerar",
            closeBtn: "Cerrar",
            usePasswordBtn: "Usar Contraseña",
            confirmDeleteTitle: "Confirmar Eliminación",
            confirmDeleteMessage: (siteName) => `¿Estás seguro de que quieres eliminar la contraseña para "${siteName}"? Esta acción no se puede deshacer.`,
            deleteConfirmBtn: "Eliminar",
            toastPasswordAdded: "Contraseña añadida correctamente.",
            toastPasswordUpdated: "Contraseña actualizada correctamente.",
            toastPasswordDeleted: "Contraseña eliminada.",
            toastErrorAdding: (msg) => `Error al añadir: ${msg}`,
            toastErrorUpdating: (msg) => `Error al actualizar: ${msg}`,
            toastErrorDeleting: (msg) => `Error al eliminar: ${msg}`,
            toastErrorLoading: (msg) => `Error cargando contraseñas: ${msg}`,
            toastCopied: (type) => `${type} copiado al portapapeles.`,
            toastErrorCopying: (type) => `Error al copiar ${type}.`,
            toastSelectToEdit: "Selecciona una contraseña para editar.",
            toastSelectToDelete: "Selecciona una contraseña para eliminar.",
            toastPasswordGeneratedToForm: "Contraseña copiada al formulario.",
            toastNoCharsetError: "Debe seleccionar al menos un tipo de caracter para generar la contraseña.",
            notAvailable: "N/A",
            noSearchResults: "No se encontraron coincidencias.",
            noPasswordsSaved: "Aún no hay contraseñas guardadas.",
            categoryUncategorized: "Sin Categoría"
        },
        en: {
            appTitle: "My Password Manager",
            passwordsMainTitle: "Passwords",
            addPasswordBtnTitle: "Add new password",
            searchPlaceholder: "Search...",
            generatePasswordBtn: "Generator",
            settingsTitle: "Settings",
            toggleSettingsTitle: "Show/Hide Settings",
            themeLabel: "Theme:",
            themeDark: "Dark",
            themeRed: "Red",
            themeBlue: "Blue",
            languageLabel: "Language:",
            emptyStateTitle: "Select or create an entry",
            emptyStateSubtitle: "Your password details will appear here.",
            editBtnTitle: "Edit",
            deleteBtnTitle: "Delete",
            usernameLabel: "Username:",
            passwordLabel: "Password:",
            togglePasswordVisibilityBtnTitle: "Show/Hide password",
            copyUsernameBtnTitle: "Copy username",
            copyPasswordBtnTitle: "Copy password",
            categoryLabel: "Category:",
            notesLabel: "Notes:",
            createdLabel: "Created:",
            modifiedLabel: "Modified:",
            addPasswordModalTitle: "Add New Password",
            editPasswordModalTitle: "Edit Password",
            siteNameModalLabel: "Site/App Name:",
            usernameModalLabel: "Username/Email:",
            passwordModalLabel: "Password:",
            generateBtnTitle: "Generate password",
            strengthLabel: "Strength:",
            strengthWeak: "Weak",
            strengthMedium: "Medium",
            strengthStrong: "Strong",
            categoryModalLabel: "Category:",
            categorySelectDefault: "-- Select --",
            categoryGames: "Games",
            categorySocial: "Social Media",
            categoryPersonal: "Personal",
            categoryWebsite: "Website",
            categoryOther: "Others",
            notesModalLabel: "Notes (optional):",
            cancelBtn: "Cancel",
            saveBtn: "Save",
            passwordGeneratorTitle: "Password Generator",
            generatedPasswordLabel: "Generated Password:",
            copyGeneratedPasswordBtnTitle: "Copy generated password",
            lengthLabel: "Length:",
            uppercaseLabel: "Uppercase (A-Z)",
            lowercaseLabel: "Lowercase (a-z)",
            numbersLabel: "Numbers (0-9)",
            symbolsLabel: "Symbols (!@#...)",
            regenerateBtn: "Regenerate",
            closeBtn: "Close",
            usePasswordBtn: "Use Password",
            confirmDeleteTitle: "Confirm Deletion",
            confirmDeleteMessage: (siteName) => `Are you sure you want to delete the password for "${siteName}"? This action cannot be undone.`,
            deleteConfirmBtn: "Delete",
            toastPasswordAdded: "Password added successfully.",
            toastPasswordUpdated: "Password updated successfully.",
            toastPasswordDeleted: "Password deleted.",
            toastErrorAdding: (msg) => `Error adding: ${msg}`,
            toastErrorUpdating: (msg) => `Error updating: ${msg}`,
            toastErrorDeleting: (msg) => `Error deleting: ${msg}`,
            toastErrorLoading: (msg) => `Error loading passwords: ${msg}`,
            toastCopied: (type) => `${type} copied to clipboard.`,
            toastErrorCopying: (type) => `Error copying ${type}.`,
            toastSelectToEdit: "Select a password to edit.",
            toastSelectToDelete: "Select a password to delete.",
            toastPasswordGeneratedToForm: "Password copied to form.",
            toastNoCharsetError: "You must select at least one character type to generate the password.",
            notAvailable: "N/A",
            noSearchResults: "No matches found.",
            noPasswordsSaved: "No passwords saved yet.",
            categoryUncategorized: "Uncategorized"
        }
    };
    let currentLang = 'es';

    // --- Settings Panel Toggle ---
    if (toggleSettingsBtn && settingsPanel) {
        toggleSettingsBtn.addEventListener('click', () => {
            settingsPanel.classList.toggle('hidden');
            // Cambiar el ícono si se desea (ej. fa-cog a fa-times)
            const icon = toggleSettingsBtn.querySelector('i');
            if (settingsPanel.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-cog');
            } else {
                icon.classList.remove('fa-cog');
                icon.classList.add('fa-times');
            }
        });
    }


    function applyTheme(themeName) {
        document.body.className = '';
        document.body.classList.add(`theme-${themeName}`, 'flex', 'h-screen', 'overflow-hidden');
        localStorage.setItem('appTheme', themeName);
        if (themeSelector) themeSelector.value = themeName;
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('appTheme') || 'dark';
        applyTheme(savedTheme);
    }

    if (themeSelector) {
        themeSelector.addEventListener('change', (e) => applyTheme(e.target.value));
    }

    function getTranslatedCategory(categoryKey) {
        if (!categoryKey) return translations[currentLang].categoryUncategorized || "Uncategorized";
        const directTranslationKey = `category${categoryKey.replace(/\s+/g, '')}`;
        if (translations[currentLang][directTranslationKey]) {
            return translations[currentLang][directTranslationKey];
        }
        return categoryKey;
    }
    
    function applyLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        document.querySelectorAll('[data-lang-key-placeholder]').forEach(el => {
            const key = el.dataset.langKeyPlaceholder;
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
        document.querySelectorAll('[data-lang-key-title]').forEach(el => {
            const key = el.dataset.langKeyTitle;
            if (translations[lang] && translations[lang][key]) {
                el.title = translations[lang][key];
            }
        });

        localStorage.setItem('appLanguage', lang);
        if (languageSelector) languageSelector.value = lang;

        if (categorySelectEl) {
            Array.from(categorySelectEl.options).forEach(option => {
                const key = option.dataset.langKey;
                if (key && translations[lang][key]) {
                    option.textContent = translations[lang][key];
                }
            });
        }
        
        const currentSearchTerm = searchInput.value;
        const filtered = allPasswords.filter(p => filterPasswords(p, currentSearchTerm));
        renderPasswordList(filtered);

        if (selectedPasswordId) {
            displayPasswordDetails(selectedPasswordId);
        } else {
            clearDetailsView();
        }
        if (passwordInputModal && passwordInputModal.value) {
             passwordStrengthMeter.updateStrength(passwordInputModal.value);
        }
    }

    function loadLanguage() {
        const savedLang = localStorage.getItem('appLanguage') || 'es';
        applyLanguage(savedLang);
    }

    if (languageSelector) {
        languageSelector.addEventListener('change', (e) => applyLanguage(e.target.value));
    }

    function showToast(messageKey, type = 'success', interpolateParam = null) {
        let messageText = translations[currentLang][messageKey] || messageKey;
        if (typeof messageText === 'function') {
            messageText = messageText(interpolateParam);
        }
        toastMessageEl.textContent = messageText;
        toastNotificationEl.className = 'fixed bottom-5 right-5 py-2 px-4 rounded-lg shadow-md z-[70] text-white transition-opacity duration-300';
        if (type === 'success') toastNotificationEl.classList.add('toast-success');
        else if (type === 'error') toastNotificationEl.classList.add('toast-error');
        else toastNotificationEl.classList.add('toast-info');
        toastNotificationEl.classList.remove('hidden', 'opacity-0');
        toastNotificationEl.classList.add('opacity-100');
        setTimeout(() => {
            toastNotificationEl.classList.remove('opacity-100');
            toastNotificationEl.classList.add('opacity-0');
            setTimeout(() => toastNotificationEl.classList.add('hidden'), 300);
        }, 3000);
    }

    function copyToClipboard(text, typeKey) {
        const typeText = translations[currentLang][typeKey] || typeKey;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => showToast('toastCopied', 'success', typeText))
                .catch(err => {
                    console.error(`Error copying ${typeText}: `, err);
                    showToast('toastErrorCopying', 'error', typeText);
                });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text; document.body.appendChild(textArea);
            textArea.focus(); textArea.select();
            try {
                document.execCommand('copy');
                showToast('toastCopied', 'success', typeText);
            } catch (err) {
                console.error(`Error copying ${typeText} (fallback): `, err);
                showToast('toastErrorCopying', 'error', typeText);
            }
            document.body.removeChild(textArea);
        }
    }

    function formatDate(dateString) {
        if (!dateString) return translations[currentLang].notAvailable || 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleString(currentLang === 'en' ? 'en-US' : 'es-ES', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch (e) { return dateString; }
    }

    async function loadPasswords() {
        const result = await window.electronAPI.getPasswords();
        if (result.error) {
            showToast('toastErrorLoading', 'error', result.error);
            allPasswords = [];
        } else {
            allPasswords = result;
        }
        const currentSearchTerm = searchInput.value;
        const filtered = allPasswords.filter(p => filterPasswords(p, currentSearchTerm));
        renderPasswordList(filtered);

        if (selectedPasswordId) {
            const stillExists = allPasswords.find(p => p.id === selectedPasswordId);
            if (stillExists) displayPasswordDetails(selectedPasswordId);
            else { clearDetailsView(); selectedPasswordId = null; }
        } else {
            clearDetailsView();
        }
    }

    function renderPasswordList(passwordsToRender) {
        passwordListContainerEl.innerHTML = '';
        const currentSearchTerm = searchInput.value;

        if (passwordsToRender.length === 0 && allPasswords.length === 0 && !currentSearchTerm) {
            const noPasswordsMessage = document.createElement('p');
            noPasswordsMessage.textContent = translations[currentLang].noPasswordsSaved;
            noPasswordsMessage.className = 'text-center text-muted p-4';
            passwordListContainerEl.appendChild(noPasswordsMessage);
            return;
        }
        if (passwordsToRender.length === 0 && currentSearchTerm) {
             const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = translations[currentLang].noSearchResults;
            noResultsMessage.className = 'text-center text-muted p-4';
            passwordListContainerEl.appendChild(noResultsMessage);
            return;
        }

        const groupedPasswords = passwordsToRender.reduce((acc, p) => {
            const category = p.category || translations[currentLang].categoryUncategorized;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(p);
            return acc;
        }, {});

        const sortedCategories = Object.keys(groupedPasswords).sort((a, b) => {
            const aTranslated = getTranslatedCategory(a);
            const bTranslated = getTranslatedCategory(b);
            const aIndex = predefinedCategories.map(c => getTranslatedCategory(c)).indexOf(aTranslated);
            const bIndex = predefinedCategories.map(c => getTranslatedCategory(c)).indexOf(bTranslated);

            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return aTranslated.localeCompare(bTranslated, currentLang);
        });
        
        if (sortedCategories.length === 0 && allPasswords.length > 0 && currentSearchTerm) {
             const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = translations[currentLang].noSearchResults;
            noResultsMessage.className = 'text-center text-muted p-4';
            passwordListContainerEl.appendChild(noResultsMessage);
            return;
        }

        sortedCategories.forEach(categoryKeyInStorage => { // categoryKeyInStorage es como se guarda (ej. "Juegos")
            const header = document.createElement('div');
            header.className = 'category-header';
            header.textContent = getTranslatedCategory(categoryKeyInStorage); // Muestra la traducción
            passwordListContainerEl.appendChild(header);

            groupedPasswords[categoryKeyInStorage].forEach(p => {
                const item = document.createElement('div');
                item.className = `password-item p-3 rounded-md cursor-pointer ${p.id === selectedPasswordId ? 'selected' : ''}`;
                item.dataset.id = p.id;
                item.innerHTML = `
                    <h3 class="font-medium text-sm truncate">${p.site_name}</h3>
                    <p class="text-xs truncate">${p.username}</p>
                `;
                item.addEventListener('click', () => {
                    selectedPasswordId = p.id;
                    displayPasswordDetails(p.id);
                    document.querySelectorAll('.password-item.selected').forEach(el => el.classList.remove('selected'));
                    item.classList.add('selected');
                });
                passwordListContainerEl.appendChild(item);
            });
        });
    }
    
    function filterPasswords(password, term) {
        const lowerTerm = term.toLowerCase();
        return password.site_name.toLowerCase().includes(lowerTerm) ||
               password.username.toLowerCase().includes(lowerTerm) ||
               (getTranslatedCategory(password.category).toLowerCase().includes(lowerTerm));
    }

    function displayPasswordDetails(id) {
        const password = allPasswords.find(p => p.id === id);
        if (password) {
            emptyStateEl.classList.add('hidden');
            detailsViewEl.classList.remove('hidden');

            detailsSiteNameEl.textContent = password.site_name;
            
            const categoryName = getTranslatedCategory(password.category);
            detailsCategoryTagEl.textContent = categoryName;
            detailsCategoryTagEl.className = 'category-tag text-xs font-semibold px-2.5 py-0.5 rounded-full';
            const categoryClassSuffix = (password.category || 'default').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''); // Sanitize for class
            detailsCategoryTagEl.classList.add(`category-tag-${categoryClassSuffix}`);
             // Fallback if specific class not found or not defined in CSS
            if (!getComputedStyle(detailsCategoryTagEl).backgroundColor || getComputedStyle(detailsCategoryTagEl).backgroundColor === 'rgba(0, 0, 0, 0)') {
                detailsCategoryTagEl.classList.remove(`category-tag-${categoryClassSuffix}`); // remove if it didn't apply
                detailsCategoryTagEl.classList.add(`category-tag-default`);
            }


            detailsCategoryTextEl.textContent = categoryName;

            detailsUsernameEl.textContent = password.username;
            detailsPasswordEl.value = password.password;
            detailsPasswordEl.type = 'password';
            togglePasswordVisibilityBtn.innerHTML = '<i class="fas fa-eye"></i>';
            detailsNotesEl.textContent = password.notes || (translations[currentLang].notAvailable || 'N/A');
            detailsCreatedAtEl.textContent = formatDate(password.created_at);
            detailsUpdatedAtEl.textContent = formatDate(password.updated_at);

            selectedPasswordId = id;
        } else {
            clearDetailsView();
        }
    }

    function clearDetailsView() {
        emptyStateEl.classList.remove('hidden');
        detailsViewEl.classList.add('hidden');
        selectedPasswordId = null;
        document.querySelectorAll('.password-item.selected').forEach(el => el.classList.remove('selected'));
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        const filtered = allPasswords.filter(p => filterPasswords(p, searchTerm));
        renderPasswordList(filtered);
    });

    function openPasswordModal(mode = 'add', passwordData = null) {
        passwordForm.reset();
        passwordStrengthMeter.updateStrength('');
        if (mode === 'add') {
            modalTitle.textContent = translations[currentLang].addPasswordModalTitle;
            passwordIdInput.value = '';
            categorySelectEl.value = "";
        } else if (mode === 'edit' && passwordData) {
            modalTitle.textContent = translations[currentLang].editPasswordModalTitle;
            passwordIdInput.value = passwordData.id;
            siteNameInput.value = passwordData.site_name;
            usernameInput.value = passwordData.username;
            passwordInputModal.value = passwordData.password;
            categorySelectEl.value = passwordData.category || "";
            notesInput.value = passwordData.notes || '';
            passwordStrengthMeter.updateStrength(passwordInputModal.value);
        }
        const titleKey = mode === 'add' ? 'addPasswordModalTitle' : 'editPasswordModalTitle';
        modalTitle.textContent = translations[currentLang][titleKey] || modalTitle.textContent;

        passwordModal.classList.remove('hidden');
        siteNameInput.focus();
    }

    function closePasswordModal() {
        passwordModal.classList.add('hidden');
    }

    addPasswordBtn.addEventListener('click', () => openPasswordModal('add'));
    editPasswordBtn.addEventListener('click', () => {
        if (selectedPasswordId) {
            const passwordToEdit = allPasswords.find(p => p.id === selectedPasswordId);
            if (passwordToEdit) openPasswordModal('edit', passwordToEdit);
        } else {
            showToast('toastSelectToEdit', 'info');
        }
    });
    cancelModalBtn.addEventListener('click', closePasswordModal);

    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            id: passwordIdInput.value ? parseInt(passwordIdInput.value) : null,
            site_name: siteNameInput.value,
            username: usernameInput.value,
            password: passwordInputModal.value,
            category: categorySelectEl.value,
            notes: notesInput.value,
        };

        let result;
        if (data.id) {
            result = await window.electronAPI.updatePassword(data);
            if (result.success) showToast('toastPasswordUpdated');
            else showToast('toastErrorUpdating', 'error', result.message || 'Unknown error');
        } else {
            result = await window.electronAPI.addPassword(data);
            if (result.success) {
                showToast('toastPasswordAdded');
                selectedPasswordId = result.id;
            } else showToast('toastErrorAdding', 'error', result.message || 'Unknown error');
        }

        if (result.success) {
            closePasswordModal();
            await loadPasswords();
            if (data.id && selectedPasswordId === data.id) displayPasswordDetails(data.id);
            else if (!data.id && result.id) {
                const newEntryElement = passwordListContainerEl.querySelector(`.password-item[data-id="${result.id}"]`);
                if (newEntryElement) newEntryElement.click();
            }
        }
    });

    function showCustomConfirm(titleKey, messageText, onConfirm) {
        const modalHTML = `
            <div id="customConfirmModal" class="fixed inset-0 modal-backdrop flex items-center justify-center p-4 z-[80]">
                <div class="modal-content p-6 rounded-lg shadow-xl w-full max-w-sm">
                    <h3 class="text-lg font-medium text-primary mb-2">${translations[currentLang][titleKey] || titleKey}</h3>
                    <p class="text-sm text-secondary mb-4">${messageText}</p>
                    <div class="flex justify-end space-x-3">
                        <button id="customConfirmCancel" class="px-4 py-2 text-sm font-medium btn-secondary rounded-md">${translations[currentLang].cancelBtn || 'Cancel'}</button>
                        <button id="customConfirmOk" class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md">${translations[currentLang].deleteConfirmBtn || 'Delete'}</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('customConfirmModal');
        document.getElementById('customConfirmOk').onclick = () => { onConfirm(); modal.remove(); };
        document.getElementById('customConfirmCancel').onclick = () => { modal.remove(); };
    }

    deletePasswordBtn.addEventListener('click', async () => {
        if (selectedPasswordId) {
            const siteName = detailsSiteNameEl.textContent;
            const message = translations[currentLang].confirmDeleteMessage(siteName);
            showCustomConfirm('confirmDeleteTitle', message, async () => {
                const result = await window.electronAPI.deletePassword(selectedPasswordId);
                if (result.success) {
                    showToast('toastPasswordDeleted');
                    selectedPasswordId = null;
                    await loadPasswords();
                } else {
                    showToast('toastErrorDeleting', 'error', result.message || 'Unknown error');
                }
            });
        } else {
            showToast('toastSelectToDelete', 'info');
        }
    });

    togglePasswordVisibilityBtn.addEventListener('click', () => {
        if (detailsPasswordEl.type === 'password') {
            detailsPasswordEl.type = 'text';
            togglePasswordVisibilityBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            detailsPasswordEl.type = 'password';
            togglePasswordVisibilityBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    });

    copyUsernameBtn.addEventListener('click', () => {
        if(detailsUsernameEl.textContent) copyToClipboard(detailsUsernameEl.textContent, 'usernameLabel');
    });
    copyPasswordBtn.addEventListener('click', () => {
        if(detailsPasswordEl.value) copyToClipboard(detailsPasswordEl.value, 'passwordLabel');
    });

    const passwordStrengthMeter = {
        bar1: document.getElementById('strengthBar1'),
        bar2: document.getElementById('strengthBar2'),
        bar3: document.getElementById('strengthBar3'),
        text: document.getElementById('strengthText'),
        updateStrength: function(password) {
            let strength = 0;
            const strengthTextEl = this.text;

            if (!password || password.length === 0) {
                this.bar1.className = ''; this.bar2.className = ''; this.bar3.className = '';
                strengthTextEl.textContent = '';
                strengthTextEl.className = 'ml-2';
                return;
            }
            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[a-z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;

            this.bar1.className = ''; this.bar2.className = ''; this.bar3.className = '';
            strengthTextEl.className = 'ml-2';

            if (strength <= 2) {
                this.bar1.className = 'strength-weak';
                strengthTextEl.textContent = translations[currentLang].strengthWeak || 'Weak';
                strengthTextEl.classList.add('text-red-500');
            } else if (strength <= 4) {
                this.bar1.className = 'strength-medium'; this.bar2.className = 'strength-medium';
                strengthTextEl.textContent = translations[currentLang].strengthMedium || 'Medium';
                strengthTextEl.classList.add('text-amber-500');
            } else {
                this.bar1.className = 'strength-strong'; this.bar2.className = 'strength-strong'; this.bar3.className = 'strength-strong';
                strengthTextEl.textContent = translations[currentLang].strengthStrong || 'Strong';
                strengthTextEl.classList.add('text-green-500');
            }
        }
    };

    if (passwordInputModal) {
        passwordInputModal.addEventListener('input', (e) => {
            passwordStrengthMeter.updateStrength(e.target.value);
        });
    }

    async function _generateAndDisplayPassword() {
        const length = parseInt(passwordLengthInput.value);
        const options = {
            useUppercase: uppercaseCb.checked,
            useLowercase: lowercaseCb.checked,
            useNumbers: numbersCb.checked,
            useSymbols: symbolsCb.checked,
        };
        const result = await window.electronAPI.generatePassword(length, options);
        if (result.password) {
            generatedPasswordOutput.value = result.password;
        } else {
            generatedPasswordOutput.value = '';
            showToast(result.error === "Debe seleccionar al menos un tipo de caracter." ? 'toastNoCharsetError' : (result.error || 'Error generating password'), 'error');
        }
    }

    function openGeneratorModal(calledFromModalInput = false) {
        currentPasswordForGeneratorModal = calledFromModalInput;
        const genModalTitleEl = generatorModal.querySelector('h3');
        if (genModalTitleEl) genModalTitleEl.textContent = translations[currentLang].passwordGeneratorTitle || "Password Generator";
        generatorModal.classList.remove('hidden');
        _generateAndDisplayPassword();
    }
    function closeGeneratorModal() {
        generatorModal.classList.add('hidden');
        currentPasswordForGeneratorModal = null;
    }

    generatePasswordSidebarBtn.addEventListener('click', () => openGeneratorModal(false));
    generateInModalBtn.addEventListener('click', () => openGeneratorModal(true));

    passwordLengthInput.addEventListener('input', (e) => {
        passwordLengthValue.textContent = e.target.value;
        _generateAndDisplayPassword();
    });
    [uppercaseCb, lowercaseCb, numbersCb, symbolsCb].forEach(cb => {
        cb.addEventListener('change', _generateAndDisplayPassword);
    });
    regeneratePasswordBtn.addEventListener('click', _generateAndDisplayPassword);
    cancelGeneratorModalBtn.addEventListener('click', closeGeneratorModal);

    copyGeneratedPasswordBtn.addEventListener('click', () => {
        if (generatedPasswordOutput.value) copyToClipboard(generatedPasswordOutput.value, 'generatedPasswordLabel');
    });
    useGeneratedPasswordBtn.addEventListener('click', () => {
        if (generatedPasswordOutput.value) {
            if (currentPasswordForGeneratorModal && passwordInputModal) {
                passwordInputModal.value = generatedPasswordOutput.value;
                passwordStrengthMeter.updateStrength(generatedPasswordOutput.value);
                showToast('toastPasswordGeneratedToForm');
            } else {
                copyToClipboard(generatedPasswordOutput.value, 'generatedPasswordLabel');
            }
            closeGeneratorModal();
        }
    });

    // --- Inicialización ---
    loadTheme();
    loadLanguage();
    loadPasswords();

    window.electronAPI.onTriggerNewEntry(() => openPasswordModal('add'));
    window.electronAPI.handleError((errorDetails) => {
        console.error("Error desde el proceso principal:", errorDetails);
        showToast(`Error: ${errorDetails.message || 'Unknown error'}`, 'error');
    });
}

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
`;
document.head.appendChild(styleSheet);