console.log("✅ NEW RISK ENGINE LOADED");
export function calculateRisk(result, vt) {

    // Default response
    const analysis = {
        risk: "UNKNOWN",
        riskScore: 0,
        confidence: "UNKNOWN",
        factors: []
    };

    // VirusTotal unavailable
    if (!vt || !vt.stats) {

        analysis.factors.push({
            type: "info",
            message: "VirusTotal data unavailable."
        });

        return analysis;
    }

    const {
        malicious = 0,
        suspicious = 0,
        harmless = 0
    } = vt.stats;

    let riskScore = 0;

    // ==========================
    // VirusTotal
    // ==========================

    if (malicious > 0) {

        riskScore += malicious * 25;

        analysis.factors.push({
            type: "danger",
            message: `${malicious} security vendor(s) flagged this website as malicious.`
        });

    }

    if (suspicious > 0) {

        riskScore += suspicious * 10;

        analysis.factors.push({
            type: "warning",
            message: `${suspicious} security vendor(s) marked this website as suspicious.`
        });

    }

    if (harmless > 0) {

        analysis.factors.push({
            type: "good",
            message: `${harmless} security vendor(s) marked this website as harmless.`
        });

    }

// ==========================
// Domain Age
// ==========================

const domainAge = result.domainInfo?.age;

if (domainAge) {

    if (domainAge.years >= 10) {

        riskScore = Math.max(0, riskScore - 15);

        analysis.factors.push({
            type: "good",
            message: `Domain is ${domainAge.years} years old.`
        });

    }

    else if (domainAge.years >= 5) {

        riskScore = Math.max(0, riskScore - 10);

        analysis.factors.push({
            type: "good",
            message: `Domain is ${domainAge.years} years old.`
        });

    }

    else if (domainAge.years >= 1) {

        analysis.factors.push({
            type: "info",
            message: `Domain is ${domainAge.years} years old.`
        });

    }

    else {

        riskScore += 20;

        analysis.factors.push({
            type: "warning",
            message: `Domain is only ${domainAge.months} month(s) old.`
        });

    }

}

    // ==========================
    // HTTPS
    // ==========================

    if (result.https) {

        analysis.factors.push({
            type: "good",
            message: "Website uses HTTPS."
        });

    } else {

        riskScore += 15;

        analysis.factors.push({
            type: "danger",
            message: "Website does not use HTTPS."
        });

    }

    // SSL Certificate Analysis
if (result.ssl) {
    if (result.ssl.expired) {
        riskScore += 35;
        analysis.factors.push({
            type: "danger",
            message: "SSL certificate has expired."
        });
    } else {
        analysis.factors.push({
            type: "good",
            message: `SSL certificate is valid for another ${result.ssl.daysRemaining} day(s).`
        });

        if (result.ssl.daysRemaining < 30) {
            riskScore += 10;
            analysis.factors.push({
                type: "warning",
                message: "SSL certificate will expire soon."
            });
        }
    }
} else {
    riskScore += 25;
    analysis.factors.push({
        type: "warning",
        message: "Unable to verify the website's SSL certificate."
    });
}
    // ==========================
    // Reachability
    // ==========================

    if (!result.reachable) {

        riskScore += 10;

        analysis.factors.push({
            type: "warning",
            message: "Website could not be reached."
        });

    } else {

        analysis.factors.push({
            type: "good",
            message: "Website is reachable."
        });

    }
    // ==========================
// URL Heuristics
// ==========================

if (result.urlHeuristics) {

    riskScore += result.urlHeuristics.score;

    analysis.factors.push(...result.urlHeuristics.factors);

}

    // ==========================
    // Reputation
    // ==========================

    if (typeof vt.reputation === "number") {

        if (vt.reputation < 0) {

            riskScore += 15;

            analysis.factors.push({
                type: "warning",
                message: "VirusTotal reputation is negative."
            });

        }

        if (vt.reputation > 0) {

            analysis.factors.push({
                type: "good",
                message: "VirusTotal reputation is positive."
            });

        }

    }

    riskScore = Math.min(riskScore, 100);

    analysis.riskScore = riskScore;

    if (riskScore >= 50)
        analysis.risk = "DANGEROUS";
    else if (riskScore >= 20)
        analysis.risk = "SUSPICIOUS";
    else
        analysis.risk = "SAFE";

    // ==========================
    // Confidence
    // ==========================

    const signals =
        malicious +
        suspicious +
        harmless;

    if (signals >= 20)
        analysis.confidence = "HIGH";
    else if (signals >= 5)
        analysis.confidence = "MEDIUM";
    else
        analysis.confidence = "LOW";

    return analysis;

}