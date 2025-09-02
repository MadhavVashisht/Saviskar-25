// Animated Counters with plus signs
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.counter-value');
    const speed = 7500;
    let counted = false;
    
    function startCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText.replace('+', '');
            const increment = Math.ceil(target / speed);
            
            if (count < target) {
                counter.innerText = Math.min(count + increment, target);
                setTimeout(() => startCounters(), 1);
            } else {
                // Add plus sign for all counters except days (second counter)
                const counterIndex = Array.from(counters).indexOf(counter);
                if (counterIndex !== 1) { // Not the days counter
                    counter.innerText = target.toLocaleString() + '+';
                } else {
                    counter.innerText = target.toLocaleString();
                }
                
                // Check if all counters are complete
                const allComplete = Array.from(counters).every(c => {
                    const value = +c.innerText.replace('+', '').replace(/,/g, '');
                    return value >= +c.getAttribute('data-target');
                });
                
                if (allComplete && !counted) {
                    counted = true;
                    triggerConfetti();
                }
            }
        });
    }
    
    // Start counters when section is in view
    const aboutSection = document.getElementById('about');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(aboutSection);
});