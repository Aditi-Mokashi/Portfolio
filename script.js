document.addEventListener('DOMContentLoaded', () => {

    // --- CURSOR GLOW EFFECT ---
    const cursorGlow = document.getElementById('cursor-glow');
    if (window.matchMedia("(pointer: fine)").matches) { // Only run on devices with a mouse
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    }

    // --- FLOATING BLOBS ---
    const blobContainer = document.getElementById('blob-container');
    const blobCount = 5;
    for (let i = 0; i < blobCount; i++) {
        const blob = document.createElement('div');
        blob.className = 'blob';
        
        const size = Math.random() * 200 + 100; // 100px to 300px
        blob.style.width = `${size}px`;
        blob.style.height = `${size}px`;
        
        blob.style.left = `${Math.random() * 100}vw`;
        blob.style.top = `${Math.random() * 100}vh`;
        
        const duration = Math.random() * 30 + 20; // 20s to 50s
        const delay = Math.random() * -10; // Stagger animations
        
        blob.style.animation = `float ${duration}s ease-in-out infinite alternate`;
        blob.style.animationDelay = `${delay}s`;

        // Assign colors from palette
        const colors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)'];
        blob.style.background = colors[i % colors.length];

        blobContainer.appendChild(blob);
    }
    // Add keyframes for blob animation dynamically
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        @keyframes float {
            from { transform: translate(${Math.random()*20-10}vw, ${Math.random()*20-10}vh) rotate(0deg); }
            to { transform: translate(${Math.random()*40-20}vw, ${Math.random()*40-20}vh) rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);


    // --- TYPEWRITER EFFECT ---
    const typewriterElement = document.getElementById('typewriter');
    const titles = ["Applied AI Engineer", "Data Engineer", "Backend Engineer"];
    let titleIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < titles[titleIndex].length) {
            typewriterElement.textContent += titles[titleIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typewriterElement.textContent = titles[titleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 50);
        } else {
            titleIndex = (titleIndex + 1) % titles.length;
            setTimeout(type, 500);
        }
    }
    type();

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: unobserve after revealing to save resources
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of the element is visible
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- COUNTER ANIMATION ---
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false;
    const impactSection = document.getElementById('impact');

    const countUp = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const isMillion = target >= 1000000;
        const isPlus = counter.innerText.includes('+');
        const isPercent = counter.innerText.includes('%');
        
        let start = 0;
        const stepTime = Math.abs(Math.floor(duration / target));

        const timer = setInterval(() => {
            start += Math.ceil(target / (duration / 16)); // Increment based on frame rate
            if (start > target) {
                start = target;
            }
            
            let displayValue;
            if (isMillion) {
                displayValue = `${(start / 1000000).toFixed(1)}M`;
            } else if (target >= 1000) {
                displayValue = `${Math.floor(start / 1000)}K`;
            } else {
                displayValue = start;
            }

            if (isPlus) displayValue += '+';
            if (isPercent) displayValue += '%';

            counter.innerText = displayValue;

            if (start === target) {
                clearInterval(timer);
                // Final formatting
                if (isMillion) counter.innerText = `${target/1000000}M+`;
                else if (target >= 1000) counter.innerText = `${target/1000}K+`;
                else if (isPercent) counter.innerText = `${target}%`;
                else counter.innerText = `${target}`;
            }
        }, 16); // roughly 60fps
    };

    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !countersAnimated) {
            counters.forEach(counter => countUp(counter));
            countersAnimated = true;
            counterObserver.unobserve(impactSection);
        }
    }, {
        threshold: 0.5
    });
    
    if (impactSection) {
        counterObserver.observe(impactSection);
    }


    // --- CARD TILT EFFECT ---
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const { width, height } = rect;
            const rotateX = (y / height - 0.5) * -10; // Max 5deg rotation
            const rotateY = (x / width - 0.5) * 10;  // Max 5deg rotation

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- SMOOTH SCROLL FOR NAV LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});
