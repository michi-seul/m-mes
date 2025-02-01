// Sélection des éléments principaux
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab");
const goToMemeTab = document.getElementById("goToMemeTab");
const saveMeme = document.getElementById("saveMeme");
const gallery = document.querySelector(".gallery");

const imageSizeSlider = document.getElementById("imageSize");
const fontSizeSlider = document.getElementById("fontSize");
const imageUpload = document.getElementById("imageUpload");
const topText = document.getElementById("topText");
const bottomText = document.getElementById("bottomText");
const generateMeme = document.getElementById("generateMeme");
const downloadMeme = document.getElementById("downloadMeme");
const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");

let uploadedImage;
let imageScale = 0.5;
let fontSize = 30;

// Fonction pour basculer entre les onglets avec animation
function switchTab(tabName) {
    tabContents.forEach((content) => {
        content.classList.remove("active");
        content.style.opacity = "0"; // Ajout d'un effet de transition
        setTimeout(() => {
            if (content.id === tabName) {
                content.classList.add("active");
                content.style.opacity = "1";
            }
        }, 300);
    });
}

// Ajout des événements aux boutons de navigation
tabButtons.forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
});
goToMemeTab.addEventListener("click", () => switchTab("meme-generator"));

// Chargement de l'image uploadée
imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        uploadedImage = new Image();
        uploadedImage.src = reader.result;
        uploadedImage.onload = () => {
            canvas.width = uploadedImage.width * imageScale;
            canvas.height = uploadedImage.height * imageScale;
            updateCanvas();
        };
    };
    reader.readAsDataURL(file);
});

// Mise à jour du canvas avec l'image et le texte
function updateCanvas() {
    if (uploadedImage) {
        const newWidth = canvas.width;
        const newHeight = canvas.height;

        ctx.clearRect(0, 0, newWidth, newHeight);
        ctx.drawImage(uploadedImage, 0, 0, newWidth, newHeight);

        // Appliquer les styles du texte
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.textAlign = "center";

        // Ajout d'un effet d'ombre
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 5;

        // Ajouter le texte
        ctx.strokeText(topText.value, newWidth / 2, fontSize + 10);
        ctx.fillText(topText.value, newWidth / 2, fontSize + 10);

        ctx.strokeText(bottomText.value, newWidth / 2, newHeight - 10);
        ctx.fillText(bottomText.value, newWidth / 2, newHeight - 10);
    }
}

// Événements pour ajuster la taille de l'image et du texte
imageSizeSlider.addEventListener("input", (event) => {
    imageScale = parseFloat(event.target.value);
    if (uploadedImage) {
        canvas.width = uploadedImage.width * imageScale;
        canvas.height = uploadedImage.height * imageScale;
        updateCanvas();
    }
});

fontSizeSlider.addEventListener("input", (event) => {
    fontSize = parseInt(event.target.value);
    updateCanvas();
});

// Génération du mème
generateMeme.addEventListener("click", () => {
    updateCanvas();
    generateMeme.classList.add("clicked"); // Effet visuel
    setTimeout(() => generateMeme.classList.remove("clicked"), 300);
});

// Téléchargement du mème
downloadMeme.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL();
    link.click();
});

// Enregistrement dans la galerie
saveMeme.addEventListener("click", () => {
    if (canvas.toDataURL()) {
        const img = document.createElement("img");
        img.src = canvas.toDataURL();
        gallery.appendChild(img);
    }
});
