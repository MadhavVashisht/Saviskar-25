// 3D Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel-3d');
    if (!carousel) return;
    
    const items = document.querySelectorAll('.carousel-3d-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    let currentIndex = 0;
    let autoRotateInterval;
    const totalItems = items.length;
    const angle = 360 / totalItems;
    
    // Initialize carousel
    function initCarousel() {
        items.forEach((item, index) => {
            // Calculate rotation for each item
            const rotation = index * angle;
            item.style.transform = `rotateY(${rotation}deg) translateZ(400px)`;
            
            // Add click event for lightbox
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').src;
                lightboxImg.src = imgSrc;
                lightbox.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                
                // Pause auto rotation when lightbox is open
                pauseAutoRotation();
            });
        });
        
        // Start auto rotation
        startAutoRotation();
    }
    
    // Rotate carousel
    function rotateCarousel() {
        carousel.style.transform = `rotateY(${currentIndex * -angle}deg)`;
    }
    
    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        rotateCarousel();
    }
    
    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        rotateCarousel();
    }
    
    // Start auto rotation
    function startAutoRotation() {
        autoRotateInterval = setInterval(nextSlide, 3000);
    }
    
    // Pause auto rotation
    function pauseAutoRotation() {
        clearInterval(autoRotateInterval);
    }
    
    // Resume auto rotation
    function resumeAutoRotation() {
        startAutoRotation();
    }
    
    // Event listeners for buttons
    nextBtn.addEventListener('click', () => {
        nextSlide();
        pauseAutoRotation();
        setTimeout(resumeAutoRotation, 5000);
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        pauseAutoRotation();
        setTimeout(resumeAutoRotation, 5000);
    });
    
    // Pause auto rotation on hover
    carousel.addEventListener('mouseenter', pauseAutoRotation);
    carousel.addEventListener('mouseleave', resumeAutoRotation);
    
    // Lightbox functionality
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.add('hidden');
        document.body.style.overflow = 'auto';
        resumeAutoRotation();
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add('hidden');
            document.body.style.overflow = 'auto';
            resumeAutoRotation();
        }
    });
    
    // Close lightbox with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            lightbox.classList.add('hidden');
            document.body.style.overflow = 'auto';
            resumeAutoRotation();
        }
    });
    
    // Initialize the carousel
    initCarousel();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Recalculate translateZ based on window width
        const translateZ = Math.min(400, window.innerWidth * 0.4);
        
        items.forEach((item, index) => {
            const rotation = index * angle;
            item.style.transform = `rotateY(${rotation}deg) translateZ(${translateZ}px)`;
        });
        
        rotateCarousel();
    });
});