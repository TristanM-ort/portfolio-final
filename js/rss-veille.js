// js/rss-veille.js
// Veille ransomware – Mars 2026 – flux corrigés

$(document).ready(function () {

    const sourcesVeille = [
        {
            nom: "CERT-FR – Bulletins",
            url: "https://www.cert.ssi.gouv.fr/rss/certfr-actualite.xml",
            couleur: "#dc3545"
        },
        {
            nom: "ANSSI – Actualités",
            url: "https://cyber.gouv.fr/actualites/rss",
            couleur: "#0052a5"
        },
        {
            nom: "The Hacker News",
            url: "https://feeds.feedburner.com/TheHackerNews",
            couleur: "#2c3e50"
        },
        {
            nom: "LeMagIT – Sécurité",
            url: "https://www.lemagit.fr/actualites/rss?thematique=securite",
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
            url: "https://www.globalsecuritymag.fr/spip.php?page=rss&id_rubrique=1",
            couleur: "#9b59b6"
        },
        // Sources bonus très pertinentes ransomware 2025-2026
        {
            nom: "BleepingComputer – Security",
            url: "https://www.bleepingcomputer.com/feed/",
            couleur: "#d35400"
        }
    ];

    $("#rss-flux").empty();

    sourcesVeille.forEach(function (source) {

        const safeId = source.nom.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const containerId = `#feed-${safeId}`;

        const sourceSection = `
            <div class="source-section" data-source="${source.nom}">
                <div class="source-header" style="background: ${source.couleur};">
                    ${source.nom}
                </div>
                <div class="source-articles" id="feed-${safeId}"></div>
            </div>
        `;

        $("#rss-flux").append(sourceSection);

        $(containerId).rss(source.url, {
            limit: 4,               // réduit à 4 pour ne pas surcharger la page
            order: "newest",        // ← très important
            layoutTemplate: "<div class='rss-items'>{entries}</div>",
            entryTemplate: `
                <div class="rss-item">
                    <h4><a href="{url}" target="_blank" rel="noopener noreferrer">{title}</a></h4>
                    <div class="rss-date">{date}</div>
                    <div class="rss-description">{shortBody}</div>
                </div>
            `,
            tokens: {
                date: function (entry) {
                    if (!entry.publishedDate) return "Date inconnue";
                    const d = new Date(entry.publishedDate);
                    return d.toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                },
                shortBody: function (entry) {
                    let text = "";
                    if (entry.description) {
                        text = $(entry.description).text().trim();
                    } else if (entry.content) {
                        text = $(entry.content).text().trim();
                    } else if (entry.contentSnippet) {
                        text = entry.contentSnippet.trim();
                    }
                    return text.length > 180 ? text.substring(0, 180) + "…" : text;
                }
            },
            success: function () {
                // Optionnel : tri global des articles les plus récents en premier ?
                // → nécessite de collecter tous les articles puis de les trier après chargement
            },
            error: function (xhr) {
                $(containerId).html(`
                    <div class="rss-item error">
                        <p style="color:#dc3545; padding:1rem;">
                            ⚠️ Impossible de charger le flux<br>
                            <small>${source.url}</small><br>
                            <a href="${source.url.replace(/\/feed\/?$/, '').replace(/\/rss\/?$/, '')}" 
                               target="_blank" style="color:#0066cc;">
                               → Aller sur le site
                            </a>
                        </p>
                    </div>
                `);
            }
        });
    });

    // Information finale
    const now = new Date().toLocaleString('fr-FR', {
        dateStyle: "medium",
        timeStyle: "short"
    });

    $("#rss-flux").after(`
        <div class="update-info">
            <p>📡 Flux mis à jour automatiquement – Dernière actualisation : ${now}</p>
            <p>Sources : CERT-FR, ANSSI, médias spécialisés cybersécurité & ransomware</p>
        </div>
    `);
});