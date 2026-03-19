// ============================================
// ANIME TECH BACKGROUND - MATRIX & CIRCUITS
// ============================================

// Matrix Rain Effect
function initMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン<>{}[]()/*-+=!@#$%^&~`█▓▒░';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    function getMatrixColors() {
        const isLightMode = document.body.classList.contains('light-mode');
        return {
            bg: isLightMode ? 'rgba(248, 250, 252, 0.08)' : 'rgba(2, 6, 23, 0.05)',
            text: isLightMode ? '#0369a1' : '#38bdf8',
            alpha: isLightMode ? 0.7 : 0.5
        };
    }
    
    function draw() {
        const colors = getMatrixColors();
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillStyle = colors.text;
            ctx.globalAlpha = Math.random() * colors.alpha + colors.alpha;
            ctx.fillText(char, x, y);
            ctx.globalAlpha = 1;
            
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 50);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Update colors when theme changes
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTimeout(draw, 100);
        });
    }
}

// Floating Particles
function initParticles() {
    const container = document.createElement('div');
    container.className = 'particles';
    document.body.insertBefore(container, document.body.firstChild);
    
    const particleCount = 15; // Reduced from 30
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particle.style.animationDelay = (Math.random() * 15) + 's';
        particle.style.width = (Math.random() * 2 + 1) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = '0.4';
        container.appendChild(particle);
    }
}

// Circuit Network
function initCircuitNetwork() {
    const container = document.createElement('div');
    container.className = 'circuit-bg';
    document.body.insertBefore(container, document.body.firstChild);
    
    const nodeCount = 8; // Reduced from 15
    
    for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.className = 'circuit-node';
        node.style.left = Math.random() * 100 + '%';
        node.style.top = Math.random() * 100 + '%';
        node.style.animationDelay = (Math.random() * 2) + 's';
        node.style.width = '4px';
        node.style.height = '4px';
        container.appendChild(node);
        
        // Create connections
        if (i > 0) {
            const prevNode = container.querySelectorAll('.circuit-node')[i - 1];
            const line = document.createElement('div');
            line.className = 'circuit-line';
            line.style.left = prevNode.style.left;
            line.style.top = prevNode.style.top;
            line.style.width = (Math.random() * 80 + 30) + 'px';
            line.style.animationDelay = (Math.random() * 3) + 's';
            container.appendChild(line);
        }
    }
}

// Code Rain (Falling code on right side)
function initCodeRain() {
    const container = document.createElement('div');
    container.className = 'code-rain';
    document.body.insertBefore(container, document.body.firstChild);
    
    const codeSnippets = [
        'function init() { return true; }',
        'const data = await fetch(url);',
        'if (x === y) { return; }',
        'for (let i = 0; i < n; i++) {}',
        'import { Component } from "./";',
        'export default class App {}',
        'console.log("Hello World");',
        'async function fetchData() {}',
        'return <Component />',
        'docker-compose up -d',
        'npm install package',
        'git commit -m "update"',
        'systemctl start service',
        'iptables -A INPUT -j ACCEPT',
        'ping -c 4 192.168.1.1'
    ];
    
    const columnCount = 5;
    
    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.className = 'code-column';
        column.style.left = (i * 40) + 'px';
        column.style.animationDuration = (Math.random() * 10 + 15) + 's';
        column.style.animationDelay = (Math.random() * 10) + 's';
        column.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        column.style.fontSize = (Math.random() * 8 + 10) + 'px';
        container.appendChild(column);
    }
}

// Tech Grid
function initTechGrid() {
    const grid = document.createElement('div');
    grid.className = 'tech-grid';
    document.body.insertBefore(grid, document.body.firstChild);
}

// Hex Pattern
function initHexPattern() {
    const hex = document.createElement('div');
    hex.className = 'hex-pattern';
    document.body.insertBefore(hex, document.body.firstChild);
}

// Glitch Effect
function initGlitchEffect() {
    const glitch = document.createElement('div');
    glitch.className = 'glitch-layer';
    document.body.insertBefore(glitch, document.body.firstChild);
    
    for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'glitch-line';
        line.style.top = (i * 20) + '%';
        line.style.animationDelay = (i * 0.8) + 's';
        glitch.appendChild(line);
    }
}

// Initialize all background effects
document.addEventListener("DOMContentLoaded", () => {
    initMatrixRain();
    initParticles();
    initCircuitNetwork();
    initCodeRain();
    initTechGrid();
    initHexPattern();
    initGlitchEffect();
    // Animation des sections au scroll
    const sections = document.querySelectorAll("section");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(40px)";
        section.style.transition = "all 0.8s ease";
        observer.observe(section);
    });

    // Menu actif
    const navLinks = document.querySelectorAll("nav a");
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }

        link.addEventListener("click", function() {
            navLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Machine à écrire
    const elements = document.querySelectorAll(".typewriter");
    
    elements.forEach(element => {
        const text = element.textContent.trim();
        element.textContent = "";
        let index = 0;

        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, 50);
            }
        }
        type();
    });

    // Mode clair/sombre
    const toggleBtn = document.getElementById("theme-toggle");
    
    if (toggleBtn) {
        // Vérifier le thème sauvegardé
        const savedTheme = localStorage.getItem("theme");
        
        if (savedTheme === "light") {
            document.body.classList.add("light-mode");
            toggleBtn.textContent = "🌙";
        }

        toggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            
            if (document.body.classList.contains("light-mode")) {
                toggleBtn.textContent = "🌙";
                localStorage.setItem("theme", "light");
            } else {
                toggleBtn.textContent = "☀️";
                localStorage.setItem("theme", "dark");
            }
        });
    }

    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});