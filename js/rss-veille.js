// js/rss-veille.js – Version debug + flux corrigés mars 2026

$(document).ready(function () {

    const sourcesVeille = [
        { nom: "CERT-FR Alertes", url: "https://www.cert.ssi.gouv.fr/alerte/feed/", couleur: "#dc3545" },
        { nom: "The Hacker News", url: "https://feeds.feedburner.com/TheHackerNews", couleur: "#2c3e50" },
        { nom: "LeMagIT – Actualités", url: "https://www.lemagit.fr/rss/actualites.xml", couleur: "#e67e22" },
        { nom: "Help Net Security", url: "https://www.helpnetsecurity.com/feed/", couleur: "#27ae60" },
        { nom: "Infosecurity Magazine", url: "https://www.infosecurity-magazine.com/rss/news/", couleur: "#3498db" },
        { nom: "Global Security Mag", url: "https://www.globalsecuritymag.fr/spip.php?page=rss&id_rubrique=1", couleur: "#9b59b6" },
        { nom: "BleepingComputer Security", url: "https://www.bleepingcomputer.com/feed/", couleur: "#d35400" }
    ];

    $("#rss-flux").empty().html('<p style="text-align:center; padding:2rem;">Chargement des flux en cours...</p>');

    let loadedCount = 0;

    sourcesVeille.forEach(function (source) {
        const safeId = source.nom.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const containerId = `#feed-${safeId}`;

        $("#rss-flux").append(`
            <div class="source-section" data-source="${source.nom}">
                <div class="source-header" style="background: ${source.couleur};">${source.nom}</div>
                <div class="source-articles" id="feed-${safeId}"></div>
            </div>
        `);

        $(containerId).rss(source.url, {
            limit: 5,
            order: "newest",
            layoutTemplate: "<div class='rss-items'>{entries}</div>",
            entryTemplate: `
                <div class="rss-item">
                    <h4><a href="{url}" target="_blank">{title}</a></h4>
                    <div class="rss-date">{date}</div>
                    <div class="rss-description">{shortBody}</div>
                </div>
            `,
            tokens: {
                date: entry => {
                    const d = entry.publishedDate ? new Date(entry.publishedDate) : new Date();
                    return d.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
                },
                shortBody: entry => {
                    let text = (entry.description || entry.content || entry.contentSnippet || '').replace(/<[^>]+>/g, '').trim();
                    return text.substring(0, 180) + (text.length > 180 ? '…' : '');
                }
            },
            success: function () {
                loadedCount++;
                if (loadedCount === sourcesVeille.length) {
                    $("#rss-flux > p").remove();
                }
            },
            error: function (e) {
                console.error("Erreur flux " + source.nom + " : ", e);
                $(containerId).html(`
                    <div class="rss-item" style="color:#dc3545; padding:1.5rem;">
                        <strong>Erreur chargement :</strong> ${source.url}<br>
                        <small>Vérifie la console (F12) – probablement CORS ou flux indisponible</small>
                    </div>
                `);
            }
        });
    });

    $("#rss-flux").after(`
        <div class="update-info">
            <p> Dernière tentative : ${new Date().toLocaleString('fr-FR')}</p>
            <p>Ouvre la console (F12) pour voir les erreurs détaillées</p>
        </div>
    `);
});