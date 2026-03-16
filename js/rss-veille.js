// js/rss-veille.js
// Veille technologique sur les ransomwares

$(document).ready(function() {
    
    // Liste des sources RSS pour la veille sur les ransomwares
    const sourcesVeille = [
        {
            nom: "CERT-FR (Alertes sécurité)",
            url: "https://www.cert.ssi.gouv.fr/feed/",
            couleur: "#dc3545"
        },
        {
            nom: "ANSSI - Actualités",
            url: "https://www.ssi.gouv.fr/feed/",
            couleur: "#0052a5"
        },
        {
            nom: "The Hacker News",
            url: "https://feeds.feedburner.com/TheHackerNews",
            couleur: "#2c3e50"
        },
        {
            nom: "LeMagIT - Sécurité",
            url: "https://www.lemagit.fr/rss/thematique/securite/",
            couleur: "#e67e22"
        },
        {
            nom: "Help Net Security",
            url: "https://www.helpnetsecurity.com/feed/",
            couleur: "#27ae60"
        },
        {
            nom: "Infosecurity Magazine",
            url: "https://www.infosecurity-magazine.com/rss/news/",
            couleur: "#3498db"
        },
        {
            nom: "Global Security Mag",
            url: "https://www.globalsecuritymag.fr/feed/",
            couleur: "#9b59b6"
        }
    ];

    // Vider le conteneur avant d'ajouter les sources
    $("#rss-flux").empty();

    // Pour chaque source, créer une section et charger le flux RSS
    sourcesVeille.forEach(function(source) {
        // Créer la section pour cette source
        const sourceSection = `
            <div class="source-section" data-source="${source.nom}">
                <div class="source-header" style="background: ${source.couleur};">
                    ${source.nom}
                </div>
                <div class="source-articles" id="feed-${source.nom.replace(/\s+/g, '-')}"></div>
            </div>
        `;
        
        // Ajouter la section au conteneur
        $("#rss-flux").append(sourceSection);
        
        // ID du conteneur pour cette source
        const containerId = `#feed-${source.nom.replace(/\s+/g, '-')}`;
        
        // Charger le flux RSS pour cette source
        $(containerId).rss(source.url, {
            limit: 5,
            layoutTemplate: '<div class="rss-items">{entries}</div>',
            entryTemplate: `
                <div class="rss-item">
                    <h3><a href="{url}" target="_blank" rel="noopener noreferrer">{title}</a></h3>
                    <div class="rss-date">{date}</div>
                    <div class="rss-description">{shortBodyPlain}</div>
                </div>
            `,
            tokens: {
                date: function(entry) {
                    const date = new Date(entry.publishedDate);
                    return date.toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                },
                shortBodyPlain: function(entry) {
                    const desc = $(entry.description).text() || entry.contentSnippet || '';
                    return desc.length > 150 ? desc.substring(0, 150) + '...' : desc;
                }
            },
            error: function() {
                $(containerId).html(`
                    <div class="rss-item">
                        <p style="color: #dc3545; padding: 1rem;">
                            ⚠️ Flux temporairement inaccessible. 
                            <br>Consultez directement le site : 
                            <a href="${source.url.replace('/feed', '').replace('feed/', '')}" target="_blank">
                                ${source.nom}
                            </a>
                        </p>
                    </div>
                `);
            }
        });
    });

    // Ajouter une info sur la mise à jour
    const updateInfo = `
        <div style="text-align: center; margin-top: 2rem; color: #6c757d; font-size: 0.9rem;">
            <p>📡 Flux mis à jour automatiquement - Dernière actualisation : ${new Date().toLocaleString('fr-FR')}</p>
            <p>Sources officielles de cybersécurité</p>
        </div>
    `;
    
    $("#rss-flux").after(updateInfo);
});