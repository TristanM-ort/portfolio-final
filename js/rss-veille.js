// js/veille-rss.js - Indépendant et optimisé
(function() {
    'use strict';

    // Configuration
    const CORS_PROXIES = [
        "https://api.allorigins.win/raw?url=",
        "https://corsproxy.io/?",
        "https://api.codetabs.com/v1/proxy?quest="
    ];
    
    let currentProxyIndex = 0;

    // Sources de veille
    const sourcesVeille = [
        { nom: "CERT-FR Alertes", url: "https://www.cert.ssi.gouv.fr/alerte/feed/", couleur: "#dc3545", categorie: "Gouvernement" },
        { nom: "ANSSI", url: "https://www.ssi.gouv.fr/feed/", couleur: "#0055aa", categorie: "Gouvernement" },
        { nom: "LeMagIT", url: "https://www.lemagit.fr/rss/actualites.xml", couleur: "#e67e22", categorie: "IT" },
        { nom: "Le Monde Informatique", url: "https://www.lemondeinformatique.fr/rss/", couleur: "#1a1a1a", categorie: "IT" },
        { nom: "Global Security Mag", url: "https://www.globalsecuritymag.fr/spip.php?page=rss&id_rubrique=1", couleur: "#9b59b6", categorie: "Sécurité" },
        { nom: "The Hacker News", url: "https://feeds.feedburner.com/TheHackerNews", couleur: "#2c3e50", categorie: "Sécurité" },
        { nom: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/", couleur: "#d35400", categorie: "Sécurité" }
    ];

    // Mots-clés pour filtrer
    const KEYWORDS = [
        'ransomware', 'rançongiciel', 'lockbit', 'blackcat', 'hive', 
        'conti', 'cyberattaque', 'cybercriminalité', 'piratage',
        'data breach', 'violation de données', 'cybersécurité',
        'ransom', 'malware', 'cybercrime'
    ];

    // Vérifier que le conteneur existe
    const container = document.getElementById('rss-flux');
    if (!container) {
        console.error("Conteneur #rss-flux introuvable");
        return;
    }

    // Afficher le message de chargement
    container.innerHTML = `
        <div class="rss-header">
            <h3>📡 Actualités Ransomwares</h3>
            <p>Chargement des flux en cours...</p>
            <div style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; margin: 20px auto; animation: spin 1s linear infinite;"></div>
        </div>
    `;

    let loadedCount = 0;
    const totalSources = sourcesVeille.length;

    // Créer les conteneurs pour chaque source
    sourcesVeille.forEach(function(source) {
        const safeId = source.nom.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        
        container.innerHTML += `
            <div class="source-section" data-source="${source.nom}" style="display: none;">
                <div class="source-header" style="background: ${source.couleur};">
                    <span>${source.nom}</span>
                    <span class="source-category">${source.categorie}</span>
                </div>
                <div class="source-articles" id="feed-${safeId}">
                    <div style="text-align: center; padding: 30px;">
                        <div style="width: 30px; height: 30px; border: 2px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; margin: 0 auto 15px; animation: spin 1s linear infinite;"></div>
                        <p style="color: var(--muted);">Récupération des articles...</p>
                    </div>
                </div>
            </div>
        `;
    });

    // Fonctions utilitaires
    function getNextProxy() {
        const proxy = CORS_PROXIES[currentProxyIndex];
        currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXIES.length;
        return proxy;
    }

    function isRansomwareRelated(title, description) {
        const text = (title + ' ' + description).toLowerCase();
        return KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
    }

    function cleanDescription(desc) {
        if (!desc) return '';
        return desc
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 200) + (desc.length > 200 ? '…' : '');
    }

    function formatDate(dateStr) {
        if (!dateStr) return 'Date inconnue';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return 'Date inconnue';
            
            return date.toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
        } catch (e) {
            return 'Date inconnue';
        }
    }

    // Charger un flux avec retry
    function loadFeed(source, retryCount = 0) {
        const safeId = source.nom.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const containerId = `feed-${safeId}`;
        const proxyUrl = getNextProxy() + encodeURIComponent(source.url);
        const sourceSection = document.querySelector(`.source-section[data-source="${source.nom}"]`);

        fetch(proxyUrl)
            .then(response => {
                if (!response.ok) throw new Error('Erreur réseau');
                return response.text();
            })
            .then(str => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(str, "text/xml");
                
                let items = [];
                const itemElements = xml.querySelectorAll('item');
                
                itemElements.forEach(item => {
                    const title = item.querySelector('title')?.textContent || '';
                    const link = item.querySelector('link')?.textContent || '';
                    let description = item.querySelector('description')?.textContent || 
                                    item.querySelector('content\\:encoded')?.textContent || '';
                    const pubDate = item.querySelector('pubDate')?.textContent || '';
                    
                    const cleanDesc = cleanDescription(description);
                    const dateStr = formatDate(pubDate);

                    if (isRansomwareRelated(title, description)) {
                        items.push({ 
                            title: title || 'Sans titre', 
                            link: link || '#', 
                            description: cleanDesc, 
                            date: dateStr 
                        });
                    }
                });

                // Trier par date
                items.sort((a, b) => {
                    if (a.date === 'Date inconnue') return 1;
                    if (b.date === 'Date inconnue') return -1;
                    return new Date(b.date) - new Date(a.date);
                }).slice(0, 5);

                const articlesContainer = document.getElementById(containerId);
                
                if (items.length > 0) {
                    let html = '<div class="rss-items">';
                    items.forEach(item => {
                        html += `
                            <div class="rss-item">
                                <h4><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></h4>
                                <div class="rss-date">${item.date}</div>
                                <div class="rss-description">${item.description}</div>
                            </div>
                        `;
                    });
                    html += '</div>';
                    
                    articlesContainer.innerHTML = html;
                    
                    // Mettre à jour le compteur
                    const headerSpan = sourceSection.querySelector('.source-header span:last-child');
                    if (headerSpan) {
                        headerSpan.textContent = `${items.length} article${items.length > 1 ? 's' : ''}`;
                    }
                } else {
                    articlesContainer.innerHTML = `
                        <div class="rss-item" style="text-align: center;">
                            <p style="color: var(--muted); margin: 0;">Aucun article sur les ransomwares récemment</p>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error(`Erreur ${source.nom}:`, error);
                
                if (retryCount < 2) {
                    setTimeout(() => {
                        loadFeed(source, retryCount + 1);
                    }, 2000);
                } else {
                    const articlesContainer = document.getElementById(containerId);
                    articlesContainer.innerHTML = `
                        <div class="rss-error">
                            <strong>⛔ Flux indisponible</strong><br>
                            <small>${source.nom}</small>
                        </div>
                    `;
                }
            })
            .finally(() => {
                if (sourceSection) {
                    sourceSection.style.display = 'block';
                }
                
                loadedCount++;
                
                if (loadedCount === totalSources) {
                    // Supprimer l'en-tête de chargement
                    const header = container.querySelector('.rss-header');
                    if (header && header.querySelector('.rss-header h3')?.textContent.includes('Chargement')) {
                        header.remove();
                    }
                    
                    // Ajouter l'info de mise à jour
                    if (!document.querySelector('.update-info')) {
                        const updateDiv = document.createElement('div');
                        updateDiv.className = 'update-info';
                        updateDiv.innerHTML = `
                            <p>Dernière mise à jour : ${new Date().toLocaleString('fr-FR')}</p>
                            <p style="font-size: 0.7rem; margin-top: 5px;">${totalSources} sources surveillées</p>
                        `;
                        container.after(updateDiv);
                    }
                }
            });
    }

    // Charger tous les flux
    sourcesVeille.forEach(source => loadFeed(source));
})();