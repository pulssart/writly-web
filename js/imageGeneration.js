// Fonction pour générer un prompt pour DALL-E à partir du contenu du post
async function generateImagePrompt(postContent) {
    try {
        const apiKey = localStorage.getItem('openaiApiKey');
        if (!apiKey) {
            throw new Error('Clé API OpenAI non définie');
        }

        const imageStyleSelect = document.getElementById('imageStyle');
        const imageStyle = imageStyleSelect.value;
        let styleDescription = '';
        
        if (imageStyle === 'custom') {
            const customPrompt = document.getElementById('customPrompt').value.trim();
            if (!customPrompt) {
                throw new Error('Veuillez entrer un prompt personnalisé');
            }
            styleDescription = customPrompt;
        } else {
            switch(imageStyle) {
                case 'cartoon_3d':
                    styleDescription = 'style cartoon 3D avec des couleurs vives';
                    break;
                case 'realistic':
                    styleDescription = 'style réaliste avec des détails précis';
                    break;
                default:
                    styleDescription = 'style moderne et professionnel';
            }
        }

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
                    content: `Crée un prompt pour DALL-E qui générera une image illustrant ce post LinkedIn : "${postContent}". L'image doit être en ${styleDescription}. Donne uniquement le prompt, sans explications.`
                }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        if (!data.choices || !data.choices[0]) {
            throw new Error('Réponse invalide de l\'API');
        }

        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Erreur lors de la génération du prompt:', error);
        throw error;
    }
}

// Fonction pour générer l'image avec DALL-E
async function generateImage(prompt) {
    try {
        const apiKey = localStorage.getItem('openaiApiKey');
        if (!apiKey) {
            throw new Error('Clé API OpenAI non définie');
        }

        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            })
        });

        const data = await response.json();
        if (!data.data || !data.data[0]) {
            throw new Error('Réponse invalide de l\'API');
        }

        const generatedImage = document.getElementById('generated-image');
        generatedImage.src = data.data[0].url;
        generatedImage.style.display = 'block';

        const regenerateButton = document.getElementById('regenerate-image');
        regenerateButton.style.display = 'block';
    } catch (error) {
        console.error('Erreur lors de la génération de l\'image:', error);
        throw error;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Gestion du style d'image personnalisé
    const imageStyleSelect = document.getElementById('imageStyle');
    const customPromptContainer = document.getElementById('customPromptContainer');

    imageStyleSelect.addEventListener('change', () => {
        customPromptContainer.style.display = 
            imageStyleSelect.value === 'custom' ? 'block' : 'none';
    });

    // Gestion de la génération d'image
    document.getElementById('generateImage').addEventListener('click', async () => {
        const generateImgButton = document.querySelector('.style-button.generate-img');
        try {
            const textArea = document.getElementById('text-area');
            const postContent = textArea.textContent;
            
            if (!postContent.trim()) {
                alert('Veuillez d\'abord générer un post avant de créer une image.');
                return;
            }
            
            generateImgButton.disabled = true;
            generateImgButton.textContent = 'Génération en cours...';
            
            const imagePrompt = await generateImagePrompt(postContent);
            await generateImage(imagePrompt);
            
            generateImgButton.textContent = 'Télécharger l\'image';
            generateImgButton.onclick = downloadGeneratedImage;
        } catch (error) {
            console.error('Erreur lors de la génération de l\'image:', error);
            alert(`Une erreur s'est produite lors de la génération de l'image: ${error.message}`);
            generateImgButton.textContent = 'Générer une image';
        } finally {
            generateImgButton.disabled = false;
        }
    });

    // Gestion de la régénération d'image
    document.getElementById('regenerate-image').addEventListener('click', async () => {
        const textArea = document.getElementById('text-area');
        const postContent = textArea.textContent;
        
        try {
            const imagePrompt = await generateImagePrompt(postContent);
            await generateImage(imagePrompt);
        } catch (error) {
            console.error('Erreur lors de la régénération de l\'image:', error);
            alert(`Une erreur s'est produite lors de la régénération de l'image: ${error.message}`);
        }
    });
});

// Fonction pour télécharger l'image générée
function downloadGeneratedImage() {
    const generatedImage = document.getElementById('generated-image');
    if (generatedImage && generatedImage.src) {
        const downloadLink = document.createElement('a');
        downloadLink.href = generatedImage.src;
        downloadLink.download = 'writly-image.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    } else {
        alert('Aucune image n\'est disponible pour le téléchargement.');
    }
} 