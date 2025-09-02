// Star Night Scratch Card functionality
function initStarNightScratch() {
    const canvas = document.getElementById('scratchCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const artistImage = document.getElementById('artistImage');
    const starNightVideo = document.getElementById('starNightVideo');
    const scratchOverlay = document.querySelector('.scratch-overlay');
    const artistRevealText = document.getElementById('artistRevealText');
    const sectionDescription = document.querySelector('.star-night .section-description');
    let isDrawing = false;
    let percentRevealed = 0;
    let isRevealed = false;
    
    // Initialize canvas with overlay
    function initCanvas() {
        // Create gradient background for scratch overlay
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#00A7D4');
        gradient.addColorStop(0.5, '#A341D1');
        gradient.addColorStop(1, '#2968ED');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.globalCompositeOperation = 'destination-out';
    }
    
    initCanvas();
    
    // Scratch functionality
    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('touchstart', startScratch);
    
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', scratch);
    
    canvas.addEventListener('mouseup', endScratch);
    canvas.addEventListener('touchend', endScratch);
    canvas.addEventListener('mouseleave', endScratch);
    
    function startScratch(e) {
        if (isRevealed) return;
        isDrawing = true;
        scratch(e);
        
        // Hide the overlay text when scratching starts
        scratchOverlay.style.opacity = '0';
    }
    
    function scratch(e) {
        if (!isDrawing || isRevealed) return;
        
        e.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        let x, y;
        
        if (e.type.includes('mouse')) {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        } else {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        }
        
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
        
        checkRevealed();
    }
    
    function endScratch() {
        isDrawing = false;
    }
    
    function checkRevealed() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        
        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] === 0) {
                transparentPixels++;
            }
        }
        
        percentRevealed = (transparentPixels / (pixels.length / 4)) * 100;
        
        if (percentRevealed >= 70 && !isRevealed) {
            isRevealed = true;
            revealArtist();
        }
    }
    
    function revealArtist() {
        // Hide the scratch canvas and overlay
        canvas.style.opacity = '0';
        scratchOverlay.style.opacity = '0';
        
        // Show the video background within the star night section only
        starNightVideo.classList.remove('hidden');
        starNightVideo.classList.add('revealed');
        
        // Update the section description
        sectionDescription.textContent = "We proudly present our special guest performers!";
        
        // Show the artist reveal text
        artistRevealText.classList.remove('hidden');
        artistRevealText.classList.add('revealed');
        
        // Switch music
        if (typeof switchToStarNightMusic === 'function') {
            switchToStarNightMusic();
        }
        
        // Trigger confetti
        if (typeof triggerConfetti === 'function') {
            triggerConfetti();
        }
        
        // Remove canvas after transition
        setTimeout(() => {
            canvas.style.display = 'none';
            scratchOverlay.style.display = 'none';
        }, 500);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the star night page
    if (document.getElementById('scratchCanvas')) {
        initStarNightScratch();
    }
});