// Animation de fond professionnelle - Effet réseau/particules connectées
(function() {
    const canvas = document.getElementById('bg-animation');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Obtenir les couleurs selon le thème
    function getColors() {
        const isLightMode = document.body.classList.contains('light-mode');
        return {
            bg: isLightMode ? 'rgba(248, 250, 252, 0.95)' : 'rgba(10, 15, 25, 0.95)',
            particle: isLightMode ? 'rgba(14, 165, 233, ' : 'rgba(0, 200, 150, ',
            line: isLightMode ? 'rgba(14, 165, 233, ' : 'rgba(0, 200, 150, '
        };
    }
    
    // Redimensionner le canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    // Configuration des particules
    const particleCount = 60;
    const connectionDistance = 150;
    const mouseDistance = 200;
    
    let particles = [];
    let mouse = { x: null, y: null };
    
    // Créer les particules
    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    createParticles();
    
    // Suivre la souris
    window.addEventListener('mousemove', function(e) {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mouseout', function() {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Dessiner une particule
    function drawParticle(particle) {
        const colors = getColors();
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = colors.particle + particle.alpha + ')';
        ctx.fill();
    }
    
    // Dessiner les connexions
    function drawConnections() {
        const colors = getColors();
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = (1 - distance / connectionDistance) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = colors.line + opacity + ')';
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Dessiner les lignes vers la souris
    function drawMouseConnections() {
        if (mouse.x === null || mouse.y === null) return;
        const colors = getColors();
        for (let i = 0; i < particles.length; i++) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseDistance) {
                const opacity = (1 - distance / mouseDistance) * 0.3;
                ctx.beginPath();
                ctx.strokeStyle = colors.line + opacity + ')';
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
    
    // Mettre à jour les particules
    function updateParticles() {
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Mouvement
            p.x += p.vx;
            p.y += p.vy;
            
            // Rebondir sur les bords
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            // Garder les particules dans l'écran
            if (p.x < 0) p.x = 0;
            if (p.x > canvas.width) p.x = canvas.width;
            if (p.y < 0) p.y = 0;
            if (p.y > canvas.height) p.y = canvas.height;
        }
    }
    
    // Animation principale
    function animate() {
        const colors = getColors();
        
        // Effacer avec un léger trail
        ctx.fillStyle = colors.bg.replace('0.95', '0.1');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dessiner le fond de base
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dessiner les connexions entre particules
        drawConnections();
        
        // Dessiner les connexions vers la souris
        drawMouseConnections();
        
        // Dessiner les particules
        for (let i = 0; i < particles.length; i++) {
            drawParticle(particles[i]);
        }
        
        // Mettre à jour
        updateParticles();
        
        requestAnimationFrame(animate);
    }
    
    // Démarrer l'animation
    animate();
})();
