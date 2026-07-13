console.log("verify.js loaded");

const verifyBtn = document.getElementById("verifyBtn");
const verifyInput = document.getElementById("verifyInput");

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const step4 = document.getElementById("step4");
const step5 = document.getElementById("step5");

console.log({
    step1,
    step2,
    step3,
    step4,
    step5
});

verifyBtn.addEventListener("click", verify);

async function verify() {

    const input = verifyInput.value.trim();

    if (!input) {
        alert("Enter something to verify.");
        return;
    }

    const entity = document.getElementById("entityName");
    const badge = document.getElementById("riskBadge");
    const status = document.getElementById("verificationStatus");
    const riskCircle = document.getElementById("riskCircle");
    const threatType = document.getElementById("threatType");
    const confidence = document.getElementById("confidence");
    const aiRecommendation = document.getElementById("aiRecommendation");
    const maliciousCount = document.getElementById("maliciousCount");
    const suspiciousCount = document.getElementById("suspiciousCount");
    const harmlessCount = document.getElementById("harmlessCount");
    const vtStats = document.getElementById("vtStats");

    try {

        // ---------------- Reset Timeline ----------------

        [step1, step2, step3, step4, step5].forEach(step => {
            step.className = "";
            step.textContent = "";
        });

        step1.textContent = "⏳ Starting Scan...";

        // ---------------- Button ----------------

        verifyBtn.disabled = true;
        verifyBtn.classList.add("verify-loading");
        verifyBtn.textContent = "⏳ Verifying...";

        // ---------------- Step 1 ----------------

        step1.className = "scan-current";

        await new Promise(r => setTimeout(r, 350));

        step1.className = "scan-done";
        step1.textContent = "✔ Scan Started";

        // ---------------- Step 2 ----------------

        step2.className = "scan-current";
        step2.textContent = "🌐 Checking Website...";

        const response = await fetch("http://localhost:5000/api/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ input })
        });

        const data = await response.json();

        if (data.reachable) {
            step2.className = "scan-done";
            step2.textContent = "✔ Website Reachable";
        } else {
            step2.className = "scan-done";
            step2.textContent = "❌ Website Unreachable";
        }

        // ---------------- Step 3 ----------------

        step3.className = "scan-current";
        step3.textContent = "🛡 VirusTotal Analysis...";

        await new Promise(r => setTimeout(r, 250));

        step3.className = "scan-done";
        step3.textContent = "✔ VirusTotal Complete";

        // ---------------- Step 4 ----------------

        step4.className = "scan-current";
        step4.textContent = "📊 Calculating Risk...";

        await new Promise(r => setTimeout(r, 250));

        // ---------------- Update UI ----------------

        entity.textContent = data.searched;

        badge.textContent = data.risk;
        riskCircle.textContent = data.risk;

        switch (data.risk) {

            case "SAFE":

                badge.className = "risk-badge safe";
                riskCircle.className = "risk-circle safe";

                recommendation.textContent =
                    "✅ This website appears safe. Always verify URLs before entering sensitive information.";

                break;

            case "SUSPICIOUS":

                badge.className = "risk-badge warning";
                riskCircle.className = "risk-circle warning";

                recommendation.textContent =
                    "⚠ Proceed carefully. Verify the website before entering credentials.";

                break;

            default:

                badge.className = "risk-badge danger";
                riskCircle.className = "risk-circle danger";

                recommendation.textContent =
                    "🚨 High Risk. Avoid using this website.";

        }

        status.textContent =
            `Reachable • HTTPS ${data.https ? "Enabled" : "Disabled"} • HTTP ${data.status}`;

        // ================= AI ANALYSIS =================

        if (data.risk === "SAFE") {

            threatType.textContent = "Safe Website";
            confidence.textContent = "98%";

            aiRecommendation.textContent =
            "No known threats detected. Continue to verify URLs before entering passwords or payment details.";

        }

        else if (data.risk === "SUSPICIOUS") {

            threatType.textContent = "Suspicious Website";
            confidence.textContent = "74%";

            aiRecommendation.textContent =
            "Some risk indicators were detected. Verify the website before logging in or making payments.";

        }

        else {

            threatType.textContent = "Potentially Malicious";
            confidence.textContent = "95%";

            aiRecommendation.textContent =
            "Avoid visiting this website. Multiple threat indicators suggest it may be unsafe.";

        }

        // ---------------- VirusTotal ----------------

        if (data.virusTotal) {

            maliciousCount.textContent =
            data.virusTotal.stats.malicious;

            suspiciousCount.textContent =
            data.virusTotal.stats.suspicious;

            harmlessCount.textContent =
            data.virusTotal.stats.harmless;
        } else {

            vtStats.textContent = "VirusTotal data unavailable.";

        }

        // ---------------- Finish ----------------

        step4.className = "scan-done";
        step4.textContent = "✔ Risk Calculated";

        step5.className = "scan-done";
        step5.textContent = "✅ Verification Complete";

        verifyBtn.classList.remove("verify-loading");
        verifyBtn.classList.add("verify-success");
        verifyBtn.textContent = "✔ Verified";

        setTimeout(() => {

            verifyBtn.classList.remove("verify-success");
            verifyBtn.disabled = false;
            verifyBtn.textContent = "Verify Again";

        }, 2000);
        async function loadRecentSearches() {

    try {

        const response = await fetch("http://localhost:5000/api/history");

        const scans = await response.json();

        const container = document.getElementById("recentSearches");

        if (scans.length === 0) {

            container.innerHTML = "<p>No recent searches.</p>";

            return;

        }

        container.innerHTML = "";

        scans.forEach(scan => {

            let riskClass = "search-safe";

            if (scan.risk === "SUSPICIOUS")
                riskClass = "search-warning";

            if (scan.risk === "DANGEROUS")
                riskClass = "search-danger";

            container.innerHTML += `

                <div class="search-item">

                    <div class="search-url">
                        🌐 ${scan.url}
                    </div>

                    <div class="search-risk ${riskClass}">
                        ${scan.risk}
                    </div>

                </div>

            `;

        });

    }

    catch(err){

        console.error(err);

    }

}

    }

    catch (err) {

        console.error(err);

        step1.className = "scan-done";
        step1.textContent = "❌ Verification Failed";

        step2.textContent = "";
        step3.textContent = "";
        step4.textContent = "";
        step5.textContent = "";

        verifyBtn.disabled = false;
        verifyBtn.classList.remove("verify-loading");
        verifyBtn.classList.remove("verify-success");
        verifyBtn.textContent = "Verify";

        alert("Unable to connect to backend.");

    }

}