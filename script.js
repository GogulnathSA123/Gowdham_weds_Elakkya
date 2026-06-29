/**
 * script.js - Cinematic Tamil Wedding Storyboard Website
 * For Elakkya & Gowdham Raj's Wedding
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Interactive Envelope Card Opener & YouTube Player Integration ---
    const envelopeCover = document.getElementById('envelope-cover');
    const mainContent = document.getElementById('main-content');
    const musicToggle = document.getElementById('music-toggle');
    const toggleIcon = musicToggle.querySelector('i');
    const tooltipText = document.querySelector('.music-tooltip');
    
    let isPlaying = false;
    let ytPlayerReady = false;

    // Load YouTube Iframe API dynamically
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Global YouTube API Ready Callback
    window.onYouTubeIframeAPIReady = function() {
        window.player = new YT.Player('youtube-player', {
            videoId: 'wjr275nhYiw', // Vikram Marriage BGM
            playerVars: {
                'autoplay': 1,      // try to play immediately
                'controls': 0,      // hide controls
                'loop': 1,          // loop track
                'playlist': 'wjr275nhYiw', // required for loop
                'mute': 0,          // unmute
                'playsinline': 1
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    };

    function onPlayerReady(event) {
        ytPlayerReady = true;
        // set sound volume slightly lower for pleasant ambience
        window.player.setVolume(35);
        
        // Attempt autoplay immediately (some browser policies may allow it depending on site score)
        if (isPlaying) {
            window.player.playVideo();
        }
    }

    function toggleMusic() {
        if (isPlaying) {
            if (ytPlayerReady && window.player && typeof window.player.pauseVideo === 'function') {
                window.player.pauseVideo();
            }
            musicToggle.classList.remove('playing');
            toggleIcon.className = 'fas fa-music';
            tooltipText.textContent = 'திருமண இசையை இயக்கு';
            isPlaying = false;
        } else {
            if (ytPlayerReady && window.player && typeof window.player.playVideo === 'function') {
                window.player.playVideo();
            }
            musicToggle.classList.add('playing');
            toggleIcon.className = 'fas fa-pause';
            tooltipText.textContent = 'இசையை நிறுத்து';
            isPlaying = true;
        }
    }

    musicToggle.addEventListener('click', toggleMusic);

    // Auto-Opening and Cinematic Walkthrough
    setTimeout(() => {
        // Automatically open the envelope card
        if (envelopeCover) envelopeCover.classList.add('open');
        if (mainContent) {
            mainContent.classList.remove('main-hidden');
            mainContent.classList.add('main-visible');
        }
        
        // Try playing the Vikram Wedding BGM immediately
        playAudio();
        
        // Start automatic narrative walkthrough
        setTimeout(startCinematicTour, 3000);
    }, 2000); // 2 seconds to view envelope cover before opening

    function playAudio() {
        isPlaying = true;
        if (ytPlayerReady && window.player && typeof window.player.playVideo === 'function') {
            window.player.playVideo();
            musicToggle.classList.add('playing');
            toggleIcon.className = 'fas fa-pause';
            tooltipText.textContent = 'இசையை நிறுத்து';
        }
        
        // Fallback: start video sound on first scroll, touch, or click due to browser autoplay policies
        const playOnInteract = () => {
            if (ytPlayerReady && window.player && typeof window.player.playVideo === 'function') {
                window.player.playVideo();
                musicToggle.classList.add('playing');
                toggleIcon.className = 'fas fa-pause';
                tooltipText.textContent = 'இசையை நிறுத்து';
                isPlaying = true;
                cleanupListeners();
            }
        };
        
        const cleanupListeners = () => {
            window.removeEventListener('click', playOnInteract);
            window.removeEventListener('scroll', playOnInteract);
            window.removeEventListener('touchstart', playOnInteract);
        };
        
        window.addEventListener('click', playOnInteract, { passive: true });
        window.addEventListener('scroll', playOnInteract, { passive: true });
        window.addEventListener('touchstart', playOnInteract, { passive: true });
    }

    function startCinematicTour() {
        const sections = [
            document.getElementById('forest-scene'),
            document.getElementById('waterfall-scene'),
            document.getElementById('sky-scene'),
            document.getElementById('divine-scene')
        ];
        
        let currentStep = 1; // Start moving to Chapter 2 (waterfall) since we are already on Chapter 1
        
        function nextStep() {
            if (currentStep < sections.length) {
                const target = sections[currentStep];
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                currentStep++;
                // Wait 5.5 seconds per scene, then go to next
                setTimeout(nextStep, 5500);
            }
        }
        
        nextStep();
    }



    // --- 2. Unified Storyboard Canvas Animation Engine ---
    const canvas = document.getElementById('story-canvas');
    const ctx = canvas.getContext('2d');
    
    let activeScene = 'forest'; // 'forest', 'waterfall', 'sky', 'blessings'
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;

    function resizeCanvas() {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic Scene Tracker via Intersection Observer
    const storyPanels = document.querySelectorAll('.story-panel');
    const sceneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeScene = entry.target.dataset.scene;
                // Transition colors or trigger burst events when scene changes
                console.log('Scene changed to: ', activeScene);
            }
        });
    }, {
        threshold: 0.3, // trigger when 30% of the section is visible
        rootMargin: '0px 0px -10% 0px'
    });

    storyPanels.forEach(panel => {
        sceneObserver.observe(panel);
    });

    // --- Particle and Asset Classes ---

    // Forest Scene: Jasmine Petals & Mango Leaves
    class ForestParticle {
        constructor(prewarm = false) {
            this.reset(prewarm);
        }
        reset(prewarm = false) {
            this.x = Math.random() * canvasWidth;
            this.y = prewarm ? Math.random() * canvasHeight : -20;
            this.size = Math.random() * 8 + 6;
            this.speedY = Math.random() * 0.7 + 0.5;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.6 + 0.3;
            this.angle = Math.random() * 360;
            this.spinSpeed = Math.random() * 1.5 - 0.75;
            this.type = Math.random() > 0.45 ? 'petal' : 'leaf';
            this.swaySpeed = Math.random() * 0.015 + 0.005;
            this.swayOffset = Math.random() * Math.PI * 2;
            this.color = null; // Used for RSVP celebration burst
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * this.swaySpeed + this.swayOffset) * 0.35;
            this.angle += this.spinSpeed;
            if (this.y > canvasHeight + 20) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            if (this.type === 'petal') {
                ctx.beginPath();
                ctx.fillStyle = this.color || '#ffffff';
                ctx.shadowBlur = 4;
                ctx.shadowColor = this.color || 'rgba(255,255,255,0.4)';
                ctx.ellipse(0, 0, this.size * 0.55, this.size, 0, 0, Math.PI * 2);
                ctx.fill();
                if (!this.color) {
                    ctx.beginPath();
                    ctx.fillStyle = 'rgba(255, 230, 160, 0.4)';
                    ctx.ellipse(0, this.size * 0.3, this.size * 0.25, this.size * 0.35, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                ctx.beginPath();
                ctx.fillStyle = this.color || 'rgba(76, 175, 80, 0.75)';
                ctx.strokeStyle = this.color || 'rgba(56, 142, 60, 0.4)';
                ctx.lineWidth = 1;
                ctx.moveTo(0, -this.size);
                ctx.quadraticCurveTo(this.size * 0.38, 0, 0, this.size);
                ctx.quadraticCurveTo(-this.size * 0.38, 0, 0, -this.size);
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = this.color ? 'rgba(255,255,255,0.3)' : 'rgba(255, 255, 255, 0.2)';
                ctx.moveTo(0, -this.size);
                ctx.lineTo(0, this.size);
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    // Waterfall Scene: Water Drops, Splashes & rising Mist
    class WaterDrop {
        constructor(prewarm = false) {
            this.reset(prewarm);
        }
        reset(prewarm = false) {
            this.x = Math.random() * canvasWidth;
            this.y = prewarm ? Math.random() * canvasHeight : -40;
            this.vy = Math.random() * 5 + 10; // high speed falling
            this.vx = Math.random() * 0.5 - 0.25;
            this.length = Math.random() * 20 + 15;
            this.width = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        update() {
            this.y += this.vy;
            this.x += this.vx;
            this.vy += 0.25; // gravity pull
            if (this.y >= canvasHeight - 20) {
                createSplash(this.x, canvasHeight - 20);
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = `rgba(180, 220, 255, ${this.opacity})`;
            ctx.lineWidth = this.width;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.vx * 2, this.y - this.length);
            ctx.stroke();
            ctx.restore();
        }
    }

    class SplashParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = Math.random() * 5 - 2.5;
            this.vy = -(Math.random() * 4 + 3);
            this.size = Math.random() * 2.5 + 1;
            this.gravity = 0.2;
            this.opacity = 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.opacity -= 0.035;
        }
        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = `rgba(220, 240, 255, ${this.opacity})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class MistParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = Math.random() * 1.5 - 0.75;
            this.vy = -Math.random() * 0.4 - 0.2;
            this.size = Math.random() * 20 + 15;
            this.opacity = Math.random() * 0.25 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.size += 0.25;
            this.opacity -= 0.004;
        }
        draw() {
            ctx.save();
            ctx.beginPath();
            let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            grad.addColorStop(0, `rgba(240, 250, 255, ${this.opacity})`);
            grad.addColorStop(1, 'rgba(240, 250, 255, 0)');
            ctx.fillStyle = grad;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Sky Scene: Twinkling Stars & Drifting Clouds
    class Star {
        constructor() {
            this.x = Math.random() * canvasWidth;
            this.y = Math.random() * canvasHeight;
            this.size = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random();
            this.speed = Math.random() * 0.02 + 0.005;
        }
        update() {
            this.opacity += this.speed;
            if (this.opacity > 1 || this.opacity < 0.1) {
                this.speed = -this.speed;
            }
        }
        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = this.opacity;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class Cloud {
        constructor() {
            this.reset();
            // Scatter initially
            this.x = Math.random() * (canvasWidth + 400) - 200;
        }
        reset() {
            this.x = -350;
            this.y = Math.random() * (canvasHeight * 0.7);
            this.speed = Math.random() * 0.25 + 0.15;
            this.size = Math.random() * 80 + 80;
            this.opacity = Math.random() * 0.15 + 0.08;
        }
        update() {
            this.x += this.speed;
            if (this.x > canvasWidth + 300) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.beginPath();
            let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            grad.addColorStop(0.7, `rgba(240, 240, 255, ${this.opacity * 0.5})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = grad;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Blessings Scene: Rising Golden Bokeh Sparks & Divine Falling Flowers
    class BlessingSpark {
        constructor(prewarm = false) {
            this.reset(prewarm);
        }
        reset(prewarm = false) {
            this.x = Math.random() * canvasWidth;
            this.y = prewarm ? Math.random() * canvasHeight : canvasHeight + 20;
            this.vy = -(Math.random() * 0.8 + 0.4); // rising up
            this.vx = Math.random() * 0.6 - 0.3;
            this.size = Math.random() * 12 + 6;
            this.opacity = Math.random() * 0.4 + 0.2;
            this.color = Math.random() > 0.4 ? 'var(--accent-gold)' : 'var(--accent-rose)';
            this.swaySpeed = Math.random() * 0.01 + 0.005;
        }
        update() {
            this.y += this.vy;
            this.x += this.vx + Math.sin(this.y * this.swaySpeed) * 0.2;
            this.opacity -= 0.0005;
            if (this.y < -20 || this.opacity <= 0) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.beginPath();
            let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            grad.addColorStop(0, this.color);
            grad.addColorStop(0.4, this.color);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.globalAlpha = this.opacity;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // --- Array Initializations ---
    let forestParticles = [];
    let waterfallDrops = [];
    let splashDrops = [];
    let mistDrops = [];
    let stars = [];
    let clouds = [];
    let blessingSparks = [];

    function prewarmAssets() {
        for (let i = 0; i < 40; i++) {
            forestParticles.push(new ForestParticle(true));
        }
        for (let i = 0; i < 120; i++) {
            waterfallDrops.push(new WaterDrop(true));
        }
        for (let i = 0; i < 60; i++) {
            stars.push(new Star());
        }
        for (let i = 0; i < 6; i++) {
            clouds.push(new Cloud());
        }
        for (let i = 0; i < 40; i++) {
            blessingSparks.push(new BlessingSpark(true));
        }
    }
    prewarmAssets();

    function createSplash(x, y) {
        if (Math.random() > 0.4) {
            splashDrops.push(new SplashParticle(x, y));
        }
        if (Math.random() > 0.8) {
            mistDrops.push(new MistParticle(x, y));
        }
    }

    // --- Main Cinematic Canvas Animation Loop ---
    function animateStoryboard() {
        // Clear screen with a slight trailing frame to soften the waterfall movement
        ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        if (activeScene === 'forest') {
            forestParticles.forEach(p => {
                p.update();
                p.draw();
            });
        }
        else if (activeScene === 'waterfall') {
            waterfallDrops.forEach(d => {
                d.update();
                d.draw();
            });
            
            // Draw crashes
            for (let i = splashDrops.length - 1; i >= 0; i--) {
                let s = splashDrops[i];
                s.update();
                if (s.opacity <= 0) {
                    splashDrops.splice(i, 1);
                } else {
                    s.draw();
                }
            }

            for (let i = mistDrops.length - 1; i >= 0; i--) {
                let m = mistDrops[i];
                m.update();
                if (m.opacity <= 0) {
                    mistDrops.splice(i, 1);
                } else {
                    m.draw();
                }
            }
        }
        else if (activeScene === 'sky') {
            stars.forEach(s => {
                s.update();
                s.draw();
            });
            clouds.forEach(c => {
                c.update();
                c.draw();
            });
        }
        else if (activeScene === 'blessings') {
            blessingSparks.forEach(b => {
                b.update();
                b.draw();
            });
            
            // Also sprinkle a few gentle flower petals in the divine section
            if (Math.random() > 0.96) {
                forestParticles.push(new ForestParticle());
            }
            for (let i = forestParticles.length - 1; i >= 0; i--) {
                let p = forestParticles[i];
                p.update();
                p.draw();
                if (p.y > canvasHeight + 10 && forestParticles.length > 30) {
                    forestParticles.splice(i, 1);
                }
            }
        }

        requestAnimationFrame(animateStoryboard);
    }
    animateStoryboard();


    // --- 3. Countdown Timer ---
    // Wedding Date: September 13th, 2026 ( Muhurtham Time: 09:00 AM IST )
    const weddingDate = new Date('September 13, 2026 09:00:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = weddingDate - now;

        if (difference < 0) {
            document.getElementById('countdown').innerHTML = `<div class="wedding-started-msg">திருமணம் இனிதே நிறைவுற்றது! தங்களின் ஆசிகளுக்கு நன்றி.</div>`;
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);


    // --- 4. Mobile Menu Navigation Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const allLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navbar.classList.remove('active');
        });
    });

    // Sync navbar and active links on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active link based on viewport
        let current = '';
        storyPanels.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 350)) {
                current = section.getAttribute('id');
            }
        });

        allLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // --- 5. Scroll Reveal animations ---
    const reveals = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });


    // --- 6. RSVP Mock Form Submission ---
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('rsvp-name').value;
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const guests = document.getElementById('rsvp-guests').value;
        const message = document.getElementById('rsvp-message').value;

        const rsvpData = {
            name,
            attendance,
            guests,
            message,
            timestamp: new Date().toISOString()
        };

        let submissions = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        submissions.push(rsvpData);
        localStorage.setItem('wedding_rsvps', JSON.stringify(submissions));

        rsvpForm.classList.add('hidden');
        rsvpSuccess.classList.remove('hidden');

        // Confetti flower explosion burst!
        celebrationSplurge();
    });

    function celebrationSplurge() {
        activeScene = 'blessings'; // switch to blessings scene to see petals
        for (let i = 0; i < 60; i++) {
            const p = new ForestParticle();
            p.y = canvasHeight + Math.random() * 100;
            p.speedY = -(Math.random() * 5 + 3); // fly up
            p.speedX = Math.random() * 8 - 4;
            p.color = `hsl(${Math.random() * 360}, 85%, 65%)`; // colorful flowers
            forestParticles.push(p);
        }
    }
});
