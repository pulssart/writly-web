// Gestion du thème
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

// Gestion du texte
function updateShareButtonState() {
    const textArea = document.getElementById('text-area');
    const shareButton = document.getElementById('shareToLinkedIn');
    
    if (textArea.textContent.trim().length > 0) {
        shareButton.style.display = 'block';
    } else {
        shareButton.style.display = 'none';
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    
    // Gestion du thème
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    // Gestion du texte
    const textArea = document.getElementById('text-area');
    textArea.addEventListener('input', updateShareButtonState);
    textArea.addEventListener('blur', updateShareButtonState);

    // Partage LinkedIn
    document.getElementById('shareToLinkedIn').addEventListener('click', () => {
        const postContent = textArea.textContent;
        window.open('https://www.linkedin.com/feed/', '_blank');
        
        navigator.clipboard.writeText(postContent)
            .then(() => {
                alert('Le texte a été copié dans votre presse-papier.\nCollez-le dans le composeur de post LinkedIn qui vient de s\'ouvrir.');
            })
            .catch(err => {
                console.error('Erreur lors de la copie :', err);
                alert('Erreur lors de la copie du texte');
            });
    });

    // Génération de post
    document.getElementById('generatePost').addEventListener('click', async () => {
        const generateButton = document.getElementById('generatePost');
        const apiKey = localStorage.getItem('openaiApiKey');
        
        if (!apiKey) {
            alert('Veuillez d\'abord configurer votre clé API OpenAI dans les paramètres.');
            return;
        }

        try {
            generateButton.disabled = true;
            generateButton.textContent = 'Génération en cours...';

            const jobTitle = localStorage.getItem('jobTitle') || '';
            const companyName = localStorage.getItem('companyName') || '';
            const userBackground = localStorage.getItem('userBackground') || '';
            const language = localStorage.getItem('language') || 'français';

            const prompt = `En tant que ${jobTitle} chez ${companyName}, avec le contexte suivant : ${userBackground}, générez un post LinkedIn professionnel et engageant en ${language}.`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [{
                        role: "user",
                        content: prompt
                    }],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                textArea.textContent = data.choices[0].message.content.trim();
                updateShareButtonState();
            } else {
                throw new Error('Réponse invalide de l\'API');
            }
        } catch (error) {
            console.error('Erreur lors de la génération :', error);
            alert('Une erreur est survenue lors de la génération du post.');
        } finally {
            generateButton.disabled = false;
            generateButton.textContent = 'Générer un post';
        }
    });
}); 