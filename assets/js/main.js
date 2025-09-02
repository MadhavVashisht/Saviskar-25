// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initNavbar();
    initCountdown();
    initMusic();
    initScrollAnimations();
    initEventCategories();
    initGallery();
    initSponsorsMarquee();
    
    // Check if music was previously allowed
    if (localStorage.getItem('musicAllowed') === 'true') {
        document.getElementById('bgMusic').play().catch(() => {
            // If autoplay is blocked, show the modal
            setTimeout(() => {
                document.getElementById('musicModal').style.display = 'flex';
            }, 1000);
        });
    } else if (localStorage.getItem('musicAllowed') === null) {
        // First visit, show the modal
        setTimeout(() => {
            document.getElementById('musicModal').style.display = 'flex';
        }, 1000);
    }
    
    // Load event data
    loadEventData();
    
    // Initialize star night scratch
    if (document.getElementById('scratchCanvas')) {
        initStarNightScratch();
    }
});

// Initialize Navbar
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const logo = document.querySelector('.logo-img');

    // Navbar scroll effect and logo visibility
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active section in navbar
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });

        // Hide logo on hero page
        if (current !== 'hero') {  // Replace 'hero' with the actual id of your hero section
            logo.style.display = 'block';
        } else {
            logo.style.display = 'none';
        }
    });

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Initialize Countdown Timer
function initCountdown() {
    const eventDate = new Date('October 14, 2025 00:00:00').getTime();
    
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        if (distance < 0) {
            clearInterval(countdown);
            document.getElementById('countdown').innerHTML = '<div class="countdown-complete">We\'re Live!</div>';
            triggerConfetti();
        }
    }, 1000);
}

// Initialize Music
function initMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const allowMusicBtn = document.getElementById('allowMusic');
    const denyMusicBtn = document.getElementById('denyMusic');
    const musicModal = document.getElementById('musicModal');
    
    // Music toggle button
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => {
                console.log('Audio play failed:', e);
                musicModal.style.display = 'flex';
            });
            musicToggle.classList.add('playing');
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
        }
    });
    
    // Music permission modal
    allowMusicBtn.addEventListener('click', () => {
        bgMusic.play().catch(e => {
            console.log('Audio play failed:', e);
        });
        musicModal.style.display = 'none';
        localStorage.setItem('musicAllowed', 'true');
        musicToggle.classList.add('playing');
    });
    
    denyMusicBtn.addEventListener('click', () => {
        musicModal.style.display = 'none';
        localStorage.setItem('musicAllowed', 'false');
    });
    
    // Switch to star night music when revealed
    window.switchToStarNightMusic = function() {
        bgMusic.src = 'assets/music/star-night.mp3';
        bgMusic.play().catch(e => {
            console.log('Audio play failed:', e);
        });
        musicToggle.classList.add('playing');
        localStorage.setItem('musicAllowed', 'true');
    };
}

// Initialize Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
    
    // Observe other elements that need animation
    document.querySelectorAll('.counter-item, .event-card, .sponsor-item').forEach(item => {
        observer.observe(item);
    });
}

// Initialize Event Categories
function initEventCategories() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Filter events
            const category = button.getAttribute('data-category');
            filterEvents(category);
        });
    });
}

// Filter Events by Category
function filterEvents(category) {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        if (card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.classList.add('visible');
            }, 100);
        } else {
            card.classList.remove('visible');
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Load Event Data
function loadEventData() {
    const eventsContainer = document.getElementById('all-events');
    
    // Sample event data (in a real application, this would come from an API)
    const events = [
        // Cultrual Events
        {
            title: 'Beat Breakers',
            category: 'cultural',
            image: 'assets/img/events/cultural/western.avif',
            description: 'Westen &amp; Choreography Group Dance'
        },
        {
            title: 'Bhartiya Nritya',
            category: 'cultural',
            image: 'assets/img/events/cultural/indian.avif',
            description: 'Indian Folk Dance'
        },
        {
            title: 'Abhinay',
            category: 'cultural',
            image: 'assets/img/events/cultural/nukkar.avif',
            description: 'One Act Play &amp; Mime'
        },
        {
            title: 'Mr. & Ms. Saviskar25',
            category: 'cultural',
            image: 'assets/img/events/cultural/fashion.avif',
            description: 'Strut your stuff and shine bright'
        },
        {
            title: 'Battle Of Bands',
            category: 'cultural',
            image: 'assets/img/events/cultural/bob.avif',
            description: 'Shred, rock, and conquer!'
        },
        {
            title: 'Saviskar Got Talent',
            category: 'cultural',
            image: 'assets/img/events/cultural/SGT.avif',
            description: 'Unleash your inner star!'
        },
        {
            title: 'Open Mic',
            category: 'cultural',
            image: 'assets/img/events/cultural/openmic.avif',
            description: 'Your stage. Your voice. Your moment.'
        },
        // Non-Tech
        {
            title: 'Ad Extravanganza',
            category: 'non-technical',
            image: 'assets/img/events/non-technical/ad.ganja.avif',
            description: ''
        },
        {
            title: 'Face Painting: Unveiling the mask',
            category: 'non-technical',
            image: 'assets/img/events/non-technical/face-painting.avif',
            description: ''
        },
        {
            title: 'Poster Making',
            category: 'non-technical',
            image: 'assets/img/events/non-technical/posterdesigning.avif',
            description: ''
        },
        {
            title: 'Best Out of Waste',
            category: 'non-technical',
            image: 'assets/img/events/non-technical/best-out-of-waste.avif',
            description: ''
        },
        {
            title: 'Cooking without Flame',
            category: 'non-technical',
            image: 'assets/img/events/non-technical/fire.avif',
            description: ''
        },
        {
            title: 'Buisness Quiz',
            category: 'non-technical',
            image: 'assets/img/events/non-technical/rbusiness-quiz.avif',
            description: ''
        },
        {
            title: 'Rangoli',
            category: 'non-technical',
            image: 'assets/img/events/non-technical/rangoli.avif',
            description: ''
        },
        {
            title: 'Best Manager',
            category: 'non-technical',
            image: 'assets/img/events/non-technical/manager.avif',
            description: ''
        },
        // Technical
        {
            title: 'Project Display',
            category: 'technical',
            image: 'assets/img/events/technical/project-display.avif',
            description: 'Showcase Your Innovation!'
        },
        {
            title: 'Robo War',
            category: 'technical',
            image: 'assets/img/events/technical/robo-war.avif',
            description: 'Witness the clash of metal and might!'
        },
        {
            title: 'Robo Race',
            category: 'technical',
            image: 'assets/img/events/technical/robo-race.avif',
            description: 'Watch robots race to the finish line!'
        },
        {
            title: 'Drone Competition',
            category: 'technical',
            image: 'assets/img/events/technical/Drone.avif',
            description: 'Soar to new heights!'
        },
        {
            title: 'Logo Designing',
            category: 'technical',
            image: 'assets/img/events/technical/logo.avif',
            description: "Design your brand's identity."
        },
        {
            title: 'Code Cracker',
            category: 'technical',
            image: 'assets/img/events/technical/codingcover.avif',
            description: 'Crack the code and conquer the challenge!'
        },
        {
            title: 'Thinkathon',
            category: 'technical',
            image: 'assets/img/events/technical/thinkathon.avif',
            description: 'Think outside the box.'
        },
        {
            title: 'Hackathon',
            category: 'technical',
            image: 'assets/img/events/technical/hackathon.avif',
            description: 'Code your future'
        },
        {
            title: 'Mobile Gaming',
            category: 'technical',
            image: 'assets/img/events/technical/lan-mobile-gaming.avif',
            description: 'Level up your game'
        },
        {
            title: 'War Of Words',
            category: 'technical',
            image: 'assets/img/events/technical/warofwords.avif',
            description: 'Battle it out with words, not weapons'
        },
        {
            title: 'Formulation Competition',
            category: 'technical',
            image: 'assets/img/events/technical/formulations.avif',
            description: 'Mix, measure, master. Prove your pharmaceutical prowess!'
        },
        {
            title: 'App Development',
            category: 'technical',
            image: 'assets/img/events/technical/app-development.avif',
            description: 'Build Your App, Change the World'
        },
        {
            title: 'Sustainable Building Design',
            category: 'technical',
            image: 'assets/img/events/technical/sustainable.avif',
            description: 'Build a better future, one brick at a time'
        },
    ];
    
    // Create event cards
    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.setAttribute('data-category', event.category);
        
        eventCard.innerHTML = `
            <div class="event-card-img" style="background-image: url(${event.image})"></div>
            <div class="event-card-content">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <button class="btn-secondary">Register Now</button>
            </div>
        `;
        
        eventsContainer.appendChild(eventCard);
    });
    filterEvents('cultural'); // Show only cultural events by default
}

// Initialize Gallery
function initGallery() {
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.carousel-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    // Calculate the initial rotation for each item
    items.forEach((item, index) => {
        const angle = (index / items.length) * 360;
        let divisor;

        if (window.innerWidth >= 1200) {
            divisor = 4; // large screens
        } else if (window.innerWidth >= 768) {
            divisor = 2; // tablets
        } else {
            divisor = 2.5; // mobile
        }
        
        item.style.transform = `rotateY(${angle}deg) translateZ(${window.innerWidth / divisor}px)`;
    });
    
    // Lightbox functionality
    items.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            lightboxImg.src = imgSrc;
            lightbox.classList.remove('hidden');
        });
    });
    
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.add('hidden');
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add('hidden');
        }
    });
}

// Initialize Sponsors Marquee
function initSponsorsMarquee() {
    const sponsorTrack = document.querySelector('.sponsor-track');
    if (!sponsorTrack) return;
    
    const sponsorItems = document.querySelectorAll('.sponsor-item');
    
    // Duplicate items for seamless looping
    sponsorItems.forEach(item => {
        const clone = item.cloneNode(true);
        sponsorTrack.appendChild(clone);
    });
}

// Confetti Effect
function triggerConfetti() {
    const confettiCanvas = document.getElementById('confettiCanvas');
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#00A7D4', '#A341D1', '#2968ED', '#FFFFFF'];
    
    for (let i = 0; i < 300; i++) {
        confetti.push({
            x: Math.random() * confettiCanvas.width,
            y: -Math.random() * confettiCanvas.height,
            size: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 360,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    
    function animateConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        confetti.forEach(conf => {
            ctx.save();
            ctx.translate(conf.x, conf.y);
            ctx.rotate(conf.rotation * Math.PI / 180);
            
            ctx.fillStyle = conf.color;
            ctx.fillRect(-conf.size / 2, -conf.size / 2, conf.size, conf.size);
            
            ctx.restore();
            
            conf.y += conf.speed;
            conf.x += Math.sin(conf.angle * Math.PI / 180) * 2;
            conf.rotation += conf.rotationSpeed;
            
            if (conf.y > confettiCanvas.height) {
                conf.y = -conf.size;
                conf.x = Math.random() * confettiCanvas.width;
            }
        });
        
        requestAnimationFrame(animateConfetti);
    }
    
    animateConfetti();
    
    // Stop after 5 seconds
    setTimeout(() => {
        confettiCanvas.width = 0;
        confettiCanvas.height = 0;
    }, 5000);
}

// Particles.js Initialization
document.addEventListener('DOMContentLoaded', function() {
    let pt;
    if (window.innerWidth >= 1200) {
        pt = 1000; // large screens
    } else if (window.innerWidth >= 768) {
        pt = 500; // tablets
    } else {
        pt = 200; // mobile
    }
    
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: pt, density: { enable: true, value_area: 800 } },
                color: { value: "#FFFFFF" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: false, // No interconnected lines
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: false, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
});
