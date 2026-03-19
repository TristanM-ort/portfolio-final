document.addEventListener("DOMContentLoaded", () => {
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