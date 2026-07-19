export function analyzeUrl(url) {

    let score = 0;
    const factors = [];

    // ==========================
    // IP Address
    // ==========================

    const ipRegex = /^(?:https?:\/\/)?(?:\d{1,3}\.){3}\d{1,3}/;

    if (ipRegex.test(url)) {

        score += 25;

        factors.push({
            type: "warning",
            message: "Website uses an IP address instead of a domain."
        });

    }

    // ==========================
    // URL Length
    // ==========================

    if (url.length > 75) {

        score += 10;

        factors.push({
            type: "warning",
            message: "URL is unusually long."
        });

    }

    // ==========================
    // @ Symbol
    // ==========================

    if (url.includes("@")) {

        score += 20;

        factors.push({
            type: "warning",
            message: "URL contains '@'."
        });

    }

    // ==========================
    // Hyphens
    // ==========================

    const hyphens = (url.match(/-/g) || []).length;

    if (hyphens >= 3) {

        score += 10;

        factors.push({
            type: "warning",
            message: "URL contains many hyphens."
        });

    }

    // ==========================
    // Suspicious TLD
    // ==========================

    const suspiciousTlds = [
        ".xyz",
        ".top",
        ".click",
        ".shop",
        ".gq",
        ".tk",
        ".ml"
    ];

    for (const tld of suspiciousTlds) {

        if (url.toLowerCase().endsWith(tld)) {

            score += 15;

            factors.push({
                type: "warning",
                message: `Uses suspicious TLD (${tld}).`
            });

            break;
        }

    }

    return {
        score,
        factors
    };

}