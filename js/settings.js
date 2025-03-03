// Gestion de la modal des paramètres
function openSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'block';
    loadSettings();
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'none';
}

function loadSettings() {
    // Charger les paramètres depuis le localStorage
    const apiKey = localStorage.getItem('openaiApiKey') || '';
    const jobTitle = localStorage.getItem('jobTitle') || '';
    const companyName = localStorage.getItem('companyName') || '';
    const userBackground = localStorage.getItem('userBackground') || '';
    const language = localStorage.getItem('language') || 'français';
    const autoTranslate = localStorage.getItem('autoTranslate') !== 'false';
    const imageStyle = localStorage.getItem('imageStyle') || 'cartoon_3d';
    const customPrompt = localStorage.getItem('customPrompt') || '';

    // Remplir les champs
    document.getElementById('apiKey').value = apiKey;
    document.getElementById('jobTitle').value = jobTitle;
    document.getElementById('companyName').value = companyName;
    document.getElementById('userBackground').value = userBackground;
    document.getElementById('language').value = language;
    document.getElementById('autoTranslate').checked = autoTranslate;
    document.getElementById('imageStyle').value = imageStyle;
    document.getElementById('customPrompt').value = customPrompt;

    // Afficher/masquer le champ de prompt personnalisé
    const customPromptContainer = document.getElementById('customPromptContainer');
    customPromptContainer.style.display = imageStyle === 'custom' ? 'block' : 'none';
}

function saveSettings() {
    // Récupérer les valeurs
    const apiKey = document.getElementById('apiKey').value;
    const jobTitle = document.getElementById('jobTitle').value;
    const companyName = document.getElementById('companyName').value;
    const userBackground = document.getElementById('userBackground').value;
    const language = document.getElementById('language').value;
    const autoTranslate = document.getElementById('autoTranslate').checked;
    const imageStyle = document.getElementById('imageStyle').value;
    const customPrompt = document.getElementById('customPrompt').value;

    // Sauvegarder dans le localStorage
    localStorage.setItem('openaiApiKey', apiKey);
    localStorage.setItem('jobTitle', jobTitle);
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('userBackground', userBackground);
    localStorage.setItem('language', language);
    localStorage.setItem('autoTranslate', autoTranslate);
    localStorage.setItem('imageStyle', imageStyle);
    localStorage.setItem('customPrompt', customPrompt);

    closeSettings();
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Gestion de l'ouverture/fermeture de la modal
    document.getElementById('openSettings').addEventListener('click', openSettings);
    document.querySelector('.close-button').addEventListener('click', closeSettings);

    // Fermer la modal si on clique en dehors
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('settingsModal');
        if (event.target === modal) {
            closeSettings();
        }
    });

    // Sauvegarder les paramètres quand ils changent
    const settingsInputs = document.querySelectorAll('#settingsModal input, #settingsModal textarea, #settingsModal select');
    settingsInputs.forEach(input => {
        input.addEventListener('change', saveSettings);
    });

    // Charger les paramètres au démarrage
    loadSettings();
}); 