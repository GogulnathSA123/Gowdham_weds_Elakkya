/**
 * script.js - Cinematic Tamil Wedding Storyboard Website
 * For Elakkya & Gowdham Raj's Wedding
 */

// Global Variables
let player;
let ytPlayerReady = false;
let isPlaying = false;
let envelopeCover, mainContent, musicToggle, toggleIcon, tooltipText;
let activeScene = 'forest'; // Active scene tracker shared globally
let canvas, ctx, canvasWidth, canvasHeight; // Canvas references shared globally

// Dynamic Avatar Object for the Cinematic Journey
const avatarImg = new Image();
avatarImg.src = 'assets/images/couple1.jpeg';
avatarImg.onerror = function() {
    console.warn("couple1.jpeg failed to load, falling back to couple.jpg");
    this.src = 'assets/images/couple.jpg';
};

const coupleAvatar = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    radius: 70, // standard circular size
    floatOffset: 0,
    opacity: 0,
    targetOpacity: 0,
    
    update() {
        this.floatOffset += 0.025;
        
        // Define target coordinates and opacity depending on the active scene!
        if (envelopeCover && envelopeCover.classList.contains('open')) {
            this.targetOpacity = 1;
            
            if (activeScene === 'forest') {
                // Forest Scene: Avatar floats gently on the right side (desktop) or center-bottom (mobile)
                if (window.innerWidth > 768) {
                    this.targetX = window.innerWidth * 0.75;
                    this.targetY = window.innerHeight * 0.5 + Math.sin(this.floatOffset) * 20;
                } else {
                    this.targetX = window.innerWidth * 0.5;
                    this.targetY = window.innerHeight * 0.72 + Math.sin(this.floatOffset) * 15;
                }
            } 
            else if (activeScene === 'waterfall') {
                // Waterfall Scene: Avatar moves smoothly to the left side, floating among drops
                if (window.innerWidth > 768) {
                    this.targetX = window.innerWidth * 0.25;
                    this.targetY = window.innerHeight * 0.5 + Math.sin(this.floatOffset) * 20;
                } else {
                    this.targetX = window.innerWidth * 0.5;
                    this.targetY = window.innerHeight * 0.72 + Math.sin(this.floatOffset) * 15;
                }
            } 
            else if (activeScene === 'sky') {
                // Sky Scene: Avatar rises up high into the clouds!
                if (window.innerWidth > 768) {
                    this.targetX = window.innerWidth * 0.75;
                    this.targetY = window.innerHeight * 0.4 + Math.sin(this.floatOffset) * 25;
                } else {
                    this.targetX = window.innerWidth * 0.5;
                    this.targetY = window.innerHeight * 0.35 + Math.sin(this.floatOffset) * 15;
                }
            } 
            else if (activeScene === 'blessings') {
                // Blessings Scene: Avatar rests centered, receiving blessings
                this.targetX = window.innerWidth * 0.5;
                if (window.innerWidth > 768) {
                    this.targetY = window.innerHeight * 0.35 + Math.sin(this.floatOffset) * 10;
                } else {
                    this.targetY = window.innerHeight * 0.38 + Math.sin(this.floatOffset) * 8;
                }
            }
        } else {
            this.targetOpacity = 0;
        }
        
        // Easing calculations for smooth organic movement (traveling effect!)
        this.x += (this.targetX - this.x) * 0.05;
        this.y += (this.targetY - this.y) * 0.05;
        this.opacity += (this.targetOpacity - this.opacity) * 0.05;
    },
    
    draw() {
        if (this.opacity <= 0.01) return;
        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Glow effect
        ctx.shadowBlur = 25;
        if (activeScene === 'blessings') {
            ctx.shadowColor = 'rgba(255, 215, 0, 0.85)'; // Gold halo glow
        } else if (activeScene === 'sky') {
            ctx.shadowColor = 'rgba(224, 242, 254, 0.7)'; // Cloud glow
        } else if (activeScene === 'waterfall') {
            ctx.shadowColor = 'rgba(14, 165, 233, 0.6)'; // Blue glow
        } else {
            ctx.shadowColor = 'rgba(34, 197, 94, 0.5)'; // Green forest glow
        }
        
        // Draw gold outline ring
        ctx.beginPath();
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 4;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw white outer dashed ring
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Clip to draw circular face avatar with loading fallback
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 2, 0, Math.PI * 2);
        ctx.clip();
        
        if (avatarImg.complete && avatarImg.naturalWidth !== 0) {
            ctx.drawImage(avatarImg, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        } else {
            // Golden placeholder with Tamil initials (இ & க)
            ctx.fillStyle = '#1b070c';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#d4af37';
            ctx.font = 'bold 24px Outfit, Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('\u0b87 \u0026 \u0b95', this.x, this.y);
        }
        
        ctx.restore();
        
        // Draw golden rays for blessings
        if (activeScene === 'blessings') {
            this.drawBlessingRays();
        }
    },
    
    drawBlessingRays() {
        ctx.save();
        ctx.globalAlpha = this.opacity * 0.35;
        const gradient = ctx.createLinearGradient(window.innerWidth / 2, 0, this.x, this.y);
        gradient.addColorStop(0, 'rgba(255, 235, 150, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.45)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(window.innerWidth / 2 - 120, 0);
        ctx.lineTo(window.innerWidth / 2 + 120, 0);
        ctx.lineTo(this.x + this.radius, this.y);
        ctx.lineTo(this.x - this.radius, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
};

// Load YouTube Iframe API dynamically on the global scope
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0] || document.body.firstChild;
if (firstScriptTag && firstScriptTag.parentNode) {
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Function to initialize the player
function initYouTubePlayer() {
    try {
        const playerElement = document.getElementById('youtube-player');
        if (!playerElement) {
            console.log("youtube-player element not found in DOM yet. Deferring init.");
            return;
        }
        
        // Check if YT is defined (as YouTube script might still be loading)
        if (typeof YT === 'undefined' || !YT.Player) {
            console.log("YouTube API (YT) not loaded yet. Player will initialize via callback.");
            return;
        }
        
        if (player) return; // Prevent double initialization
        
        console.log("Initializing YouTube Player...");
        player = new YT.Player('youtube-player', {
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
    } catch (e) {
        console.error("YouTube player initialization error: ", e);
    }
}

// Global YouTube API Ready Callback
window.onYouTubeIframeAPIReady = function() {
    console.log("YouTube API is ready");
    if (document.getElementById('youtube-player')) {
        initYouTubePlayer();
    }
};

function onPlayerReady(event) {
    console.log("YouTube Player is ready");
    try {
        ytPlayerReady = true;
        player.setVolume(35);
        if (isPlaying) {
            player.playVideo();
        }
    } catch (e) {
        console.error("YouTube onPlayerReady event handling error: ", e);
    }
}

function playAudio() {
    isPlaying = true;
    try {
        if (ytPlayerReady && player && typeof player.playVideo === 'function') {
            player.playVideo();
            if (musicToggle) musicToggle.classList.add('playing');
            if (toggleIcon) toggleIcon.className = 'fas fa-pause';
            if (tooltipText) tooltipText.textContent = 'இசையை நிறுத்து';
        }
    } catch (e) {
        console.error("Play audio error: ", e);
    }
    
    // Fallback listeners for interaction due to browser autoplay policies
    const playOnInteract = () => {
        try {
            if (ytPlayerReady && player && typeof player.playVideo === 'function') {
                player.playVideo();
                if (musicToggle) musicToggle.classList.add('playing');
                if (toggleIcon) toggleIcon.className = 'fas fa-pause';
                if (tooltipText) tooltipText.textContent = 'இசையை நிறுத்து';
                isPlaying = true;
                cleanupListeners();
            }
        } catch (e) {
            console.error("Play on interact fallback error: ", e);
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

function toggleMusic() {
    try {
        if (isPlaying) {
            if (ytPlayerReady && player && typeof player.pauseVideo === 'function') {
                player.pauseVideo();
            }
            if (musicToggle) musicToggle.classList.remove('playing');
            if (toggleIcon) toggleIcon.className = 'fas fa-music';
            if (tooltipText) tooltipText.textContent = 'திருமண இசையை இயக்கு';
            isPlaying = false;
        } else {
            if (ytPlayerReady && player && typeof player.playVideo === 'function') {
                player.playVideo();
            }
            if (musicToggle) musicToggle.classList.add('playing');
            if (toggleIcon) toggleIcon.className = 'fas fa-pause';
            if (tooltipText) tooltipText.textContent = 'இசையை நிறுத்து';
            isPlaying = true;
        }
    } catch (e) {
        console.error("Toggle music error: ", e);
    }
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
                activeScene = target.dataset.scene; // update active scene explicitly during auto-scroll
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Instantly reveal all text inside the scrolled target section as fallback
                const targetReveals = target.querySelectorAll('.scroll-reveal');
                targetReveals.forEach(el => el.classList.add('revealed'));
            }
            currentStep++;
            // Wait 5.5 seconds per scene, then go to next
            setTimeout(nextStep, 5500);
        }
    }
    
    nextStep();
}

// --- DOM Content Initialization ---
function initWeddingApp() {
    console.log("initWeddingApp fired");
    envelopeCover = document.getElementById('envelope-cover');
    mainContent = document.getElementById('main-content');
    musicToggle = document.getElementById('music-toggle');
    if (musicToggle) {
        toggleIcon = musicToggle.querySelector('i');
        tooltipText = document.querySelector('.music-tooltip');
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    // Initialize the YouTube player now that the DOM is ready
    try {
        initYouTubePlayer();
    } catch (e) {
        console.error("Failed to initialize player on DOM ready: ", e);
    }
    
    // Auto-Opening and Walkthrough Timer
    setTimeout(() => {
        if (envelopeCover) envelopeCover.classList.add('open');
        if (mainContent) {
            mainContent.classList.remove('main-hidden');
            mainContent.classList.add('main-visible');
        }
        
        // Immediately reveal the first section's content to guarantee text visibility on load
        const firstScene = document.getElementById('forest-scene');
        if (firstScene) {
            const reveals = firstScene.querySelectorAll('.scroll-reveal');
            reveals.forEach(el => el.classList.add('revealed'));
        }
        
        // Start background music
        playAudio();
        
        // Start automatic narrative walkthrough
        setTimeout(startCinematicTour, 3000);
    }, 2000); // 2 seconds delay on load

    // --- 2. Unified Storyboard Canvas Animation Engine ---
    canvas = document.getElementById('story-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    activeScene = 'forest'; // 'forest', 'waterfall', 'sky', 'blessings'
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    function resizeCanvas() {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic Scene Tracker via Intersection Observer (wrapped in safety checks)
    const storyPanels = document.querySelectorAll('.story-panel');
    if ('IntersectionObserver' in window) {
        const sceneObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activeScene = entry.target.dataset.scene;
                    console.log('Scene changed to: ', activeScene);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -10% 0px'
        });

        storyPanels.forEach(panel => {
            sceneObserver.observe(panel);
        });
    }

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
            this.color = null;
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
            
            // Add a 3D leaf/petal folding simulation (by scaling horizontally over time)
            let foldScale = Math.sin(this.angle * 0.05);
            ctx.scale(foldScale, 1.0);
            
            ctx.globalAlpha = this.opacity;
            
            if (this.type === 'petal') {
                // Jasmine Petal: Teardrop shape with a soft white-to-light-pink gradient
                ctx.beginPath();
                let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.7, '#fff5f7');
                grad.addColorStop(1, '#ffe0e6');
                ctx.fillStyle = grad;
                
                ctx.shadowBlur = 4;
                ctx.shadowColor = 'rgba(255, 192, 203, 0.4)';
                
                // Draw petal shape
                ctx.moveTo(0, -this.size);
                ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.3, this.size * 0.6, this.size * 0.3, 0, this.size);
                ctx.bezierCurveTo(-this.size * 0.6, this.size * 0.3, -this.size * 0.6, -this.size * 0.3, 0, -this.size);
                ctx.fill();
            } else {
                // Mango Leaf: Detailed pointed leaf with vein and green gradient shading
                ctx.beginPath();
                let grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
                grad.addColorStop(0, '#85cc3d'); // fresh bright green
                grad.addColorStop(0.5, '#4caf50'); // standard green
                grad.addColorStop(1, '#2e7d32'); // dark green
                ctx.fillStyle = grad;
                
                ctx.shadowBlur = 3;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
                
                // Draw leaf shape
                ctx.moveTo(0, -this.size);
                ctx.quadraticCurveTo(this.size * 0.4, -this.size * 0.2, 0, this.size);
                ctx.quadraticCurveTo(-this.size * 0.4, -this.size * 0.2, 0, -this.size);
                ctx.fill();
                
                // Draw central vein
                ctx.beginPath();
                ctx.strokeStyle = '#a2e05c';
                ctx.lineWidth = 1.5;
                ctx.moveTo(0, -this.size);
                ctx.lineTo(0, this.size);
                ctx.stroke();
                
                // Draw side veins
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(162, 224, 92, 0.5)';
                ctx.lineWidth = 0.8;
                for (let j = -2; j <= 2; j++) {
                    if (j === 0) continue;
                    let vy = (j / 3) * this.size;
                    ctx.moveTo(0, vy);
                    ctx.lineTo(this.size * 0.2 * Math.sign(j), vy + this.size * 0.15);
                }
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
            // Concentrate drops more towards the center area where the waterfall is usually situated
            if (Math.random() > 0.35) {
                this.x = (Math.random() * 0.4 + 0.3) * canvasWidth;
            } else {
                this.x = Math.random() * canvasWidth;
            }
            this.y = prewarm ? Math.random() * canvasHeight : -50;
            this.vy = Math.random() * 10 + 16; // much faster waterfall fall
            this.vx = Math.random() * 0.4 - 0.2;
            this.length = Math.random() * 35 + 20; // longer motion blur lines
            this.width = Math.random() * 1.8 + 0.8;
            this.opacity = Math.random() * 0.5 + 0.4;
        }
        update() {
            this.y += this.vy;
            this.x += this.vx;
            if (this.y >= canvasHeight - 20) {
                createSplash(this.x, canvasHeight - 20);
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.beginPath();
            
            // Render waterfall drops with a fading linear gradient to simulate motion blur
            let grad = ctx.createLinearGradient(this.x, this.y - this.length, this.x, this.y);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(1, `rgba(200, 230, 255, ${this.opacity})`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = this.width;
            ctx.moveTo(this.x, this.y - this.length);
            ctx.lineTo(this.x, this.y);
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
            this.x = Math.random() * (canvasWidth + 400) - 200;
        }
        reset() {
            this.x = -400;
            this.y = Math.random() * (canvasHeight * 0.6);
            this.speed = Math.random() * 0.15 + 0.1;
            this.size = Math.random() * 70 + 60; // base size
            this.opacity = Math.random() * 0.12 + 0.08;
            
            // Create puff offsets to draw a realistic fluffy cloud shape
            this.puffs = [];
            let puffCount = 5 + Math.floor(Math.random() * 4);
            for(let i = 0; i < puffCount; i++) {
                this.puffs.push({
                    dx: (Math.random() - 0.5) * this.size * 1.5,
                    dy: (Math.random() - 0.3) * this.size * 0.5,
                    sizeFactor: Math.random() * 0.4 + 0.7
                });
            }
        }
        update() {
            this.x += this.speed;
            if (this.x > canvasWidth + 400) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            this.puffs.forEach(puff => {
                let px = this.x + puff.dx;
                let py = this.y + puff.dy;
                let pSize = this.size * puff.sizeFactor;
                
                ctx.beginPath();
                let grad = ctx.createRadialGradient(px, py, 0, px, py, pSize);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                grad.addColorStop(0.6, 'rgba(245, 245, 255, 0.6)');
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = grad;
                ctx.arc(px, py, pSize, 0, Math.PI * 2);
                ctx.fill();
            });
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
            this.vy = -(Math.random() * 0.8 + 0.4);
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

    class BlessingRay {
        constructor() {
            this.reset();
        }
        reset() {
            this.startX = canvasWidth / 2 + (Math.random() * 400 - 200);
            this.startY = -50;
            this.angle = Math.PI / 2 + (Math.random() * 0.4 - 0.2);
            this.length = Math.random() * canvasHeight * 0.8 + canvasHeight * 0.4;
            this.width = Math.random() * 80 + 40;
            this.opacity = Math.random() * 0.15 + 0.1;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.color = Math.random() > 0.5 ? '255, 223, 128' : '255, 235, 179';
        }
        update() {
            this.pulsePhase += this.pulseSpeed;
            this.angle += Math.sin(this.pulsePhase * 0.5) * 0.0005;
        }
        draw() {
            ctx.save();
            let endX = this.startX + Math.cos(this.angle) * this.length;
            let endY = this.startY + Math.sin(this.angle) * this.length;

            let grad = ctx.createLinearGradient(this.startX, this.startY, endX, endY);
            let currentOpacity = this.opacity * (0.7 + Math.sin(this.pulsePhase) * 0.3);
            grad.addColorStop(0, `rgba(${this.color}, ${currentOpacity})`);
            grad.addColorStop(0.5, `rgba(${this.color}, ${currentOpacity * 0.45})`);
            grad.addColorStop(1, `rgba(${this.color}, 0)`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            
            let perpAngle = this.angle + Math.PI / 2;
            let halfWidth = this.width / 2;
            let startX1 = this.startX - Math.cos(perpAngle) * halfWidth;
            let startY1 = this.startY - Math.sin(perpAngle) * halfWidth;
            let startX2 = this.startX + Math.cos(perpAngle) * halfWidth;
            let startY2 = this.startY + Math.sin(perpAngle) * halfWidth;
            
            let endX1 = endX - Math.cos(perpAngle) * halfWidth * 1.8;
            let endY1 = endY - Math.sin(perpAngle) * halfWidth * 1.8;
            let endX2 = endX + Math.cos(perpAngle) * halfWidth * 1.8;
            let endY2 = endY + Math.sin(perpAngle) * halfWidth * 1.8;

            ctx.moveTo(startX1, startY1);
            ctx.lineTo(startX2, startY2);
            ctx.lineTo(endX2, endY2);
            ctx.lineTo(endX1, endY1);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    class BlessingFlower {
        constructor(prewarm = false) {
            this.reset(prewarm);
        }
        reset(prewarm = false) {
            this.x = Math.random() * canvasWidth;
            this.y = prewarm ? Math.random() * canvasHeight : -30;
            this.size = Math.random() * 12 + 10;
            this.vy = Math.random() * 1 + 1.2;
            this.vx = Math.random() * 0.8 - 0.4;
            this.angle = Math.random() * 360;
            this.spinSpeed = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.6 + 0.4;
            this.swaySpeed = Math.random() * 0.02 + 0.01;
            this.swayOffset = Math.random() * Math.PI * 2;
        }
        update() {
            this.y += this.vy;
            this.x += this.vx + Math.sin(this.y * this.swaySpeed + this.swayOffset) * 0.5;
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

            // Draw a beautiful soft rose pink lotus blossom
            ctx.fillStyle = '#ff6b8b';
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 0.4, this.size, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ff8da1';
            ctx.beginPath();
            ctx.ellipse(-this.size * 0.3, this.size * 0.1, this.size * 0.3, this.size * 0.8, Math.PI / 6, 0, Math.PI * 2);
            ctx.ellipse(this.size * 0.3, this.size * 0.1, this.size * 0.3, this.size * 0.8, -Math.PI / 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffe066';
            ctx.beginPath();
            ctx.arc(0, this.size * 0.4, this.size * 0.25, 0, Math.PI * 2);
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
    let blessingRays = [];
    let blessingFlowers = [];

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
        for (let i = 0; i < 8; i++) {
            blessingRays.push(new BlessingRay());
        }
        for (let i = 0; i < 20; i++) {
            blessingFlowers.push(new BlessingFlower(true));
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
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Update and draw the couple's travelling avatar
        coupleAvatar.update();
        coupleAvatar.draw();

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
            // Draw blessing sparks (glowing particles)
            blessingSparks.forEach(b => {
                b.update();
                b.draw();
            });
            // Draw blessing rays (light beams)
            blessingRays.forEach(r => {
                r.update();
                r.draw();
            });
            // Draw falling lotuses (divine flower shower)
            blessingFlowers.forEach(f => {
                f.update();
                f.draw();
            });
            // Occasionally spawn a forest particle for ambience
            if (Math.random() > 0.96) {
                forestParticles.push(new ForestParticle());
            }
            // Update and render forest particles
            for (let i = forestParticles.length - 1; i >= 0; i--) {
                const p = forestParticles[i];
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

        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // --- 4. Mobile Menu Navigation Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const allLinks = document.querySelectorAll('.nav-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navbar.classList.toggle('active');
        });
    }

    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            if (navbar) navbar.classList.remove('active');
        });
    });

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

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
    if ('IntersectionObserver' in window) {
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
    } else {
        // Fallback: immediately show all elements if observer is not supported
        reveals.forEach(reveal => {
            reveal.classList.add('revealed');
        });
    }

    // --- 6. RSVP Mock Form Submission ---
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');

    if (rsvpForm) {
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
            if (rsvpSuccess) rsvpSuccess.classList.remove('hidden');

            celebrationSplurge();
        });
    }

    function celebrationSplurge() {
        activeScene = 'blessings';
        for (let i = 0; i < 60; i++) {
            const p = new ForestParticle();
            p.y = canvasHeight + Math.random() * 100;
            p.speedY = -(Math.random() * 5 + 3);
            p.speedX = Math.random() * 8 - 4;
            p.color = `hsl(${Math.random() * 360}, 85%, 65%)`;
            forestParticles.push(p);
        }
    }
}

// Ensure initWeddingApp runs regardless of document load timing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeddingApp);
} else {
    initWeddingApp();
}
