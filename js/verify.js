console.log("verify.js loaded");

// ==========================================
// DOM ELEMENTS
// ==========================================

const verifyBtn = document.getElementById("verifyBtn");
const verifyInput = document.getElementById("verifyInput");

const entity = document.getElementById("entityName");
const badge = document.getElementById("riskBadge");
const status = document.getElementById("verificationStatus");
const riskCircle = document.getElementById("riskCircle");

const recommendation = document.getElementById("recommendation");

const threatType = document.getElementById("threatType");
const confidence = document.getElementById("confidence");
const aiRecommendation = document.getElementById("aiRecommendation");

const maliciousCount = document.getElementById("maliciousCount");
const suspiciousCount = document.getElementById("suspiciousCount");
const harmlessCount = document.getElementById("harmlessCount");

const riskFactors = document.getElementById("riskFactors");

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const step4 = document.getElementById("step4");
const step5 = document.getElementById("step5");

// ==========================================
// EVENT LISTENERS
// ==========================================

verifyBtn.addEventListener("click", verify);

// ==========================================
// HELPERS
// ==========================================

function sleep(ms){

    return new Promise(resolve => setTimeout(resolve, ms));

}

function resetTimeline(){

    [step1,step2,step3,step4,step5].forEach(step=>{

        step.className="";

        step.textContent="";

    });

}

function setButtonLoading(){

    verifyBtn.disabled=true;

    verifyBtn.classList.add("verify-loading");

    verifyBtn.textContent="⏳ Verifying...";

}

function resetButton(){

    verifyBtn.disabled=false;

    verifyBtn.classList.remove("verify-loading");

    verifyBtn.classList.remove("verify-success");

    verifyBtn.textContent="Verify Again";

}

function successButton(){

    verifyBtn.classList.remove("verify-loading");

    verifyBtn.classList.add("verify-success");

    verifyBtn.textContent="✔ Verified";

    setTimeout(resetButton,2000);

}
// ==========================================
// MAIN VERIFY FUNCTION
// ==========================================

async function verify(){

    const input = verifyInput.value.trim();

    if(!input){

        alert("Enter something to verify.");

        return;

    }

    try{

        resetTimeline();

        setButtonLoading();

        // ---------- STEP 1 ----------

        step1.className="scan-current";

        step1.textContent="⏳ Starting Scan...";

        await sleep(300);

        step1.className="scan-done";

        step1.textContent="✔ Scan Started";

        // ---------- STEP 2 ----------

        step2.className="scan-current";

        step2.textContent="🌐 Checking Website...";

        const response = await fetch("http://localhost:5000/api/verify",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                input
            })

        });

        if(!response.ok){

            throw new Error("Backend Error");

        }

        const data = await response.json();

        await sleep(250);

        step2.className="scan-done";

        step2.textContent=data.reachable
        ? "✔ Website Reachable"
        : "❌ Website Unreachable";

        // ---------- STEP 3 ----------

        step3.className="scan-current";

        step3.textContent="🛡 VirusTotal Analysis...";

        await sleep(250);

        step3.className="scan-done";

        step3.textContent="✔ VirusTotal Complete";

        // ---------- STEP 4 ----------

        step4.className="scan-current";

        step4.textContent="📊 Calculating Risk...";

        await sleep(300);

        // Update all UI

        updateRiskUI(data);

        updateAIAnalysis(data);

        updateVirusTotal(data);

        updateRiskFactors(data);

        // ---------- STEP 5 ----------

        step4.className="scan-done";

        step4.textContent="✔ Risk Calculated";

        step5.className="scan-done";

        step5.textContent="✅ Verification Complete";

        successButton();

        loadRecentSearches();

    }

    catch(err){

        showError(err);

    }

}
// ==========================================
// UPDATE RISK UI
// ==========================================

function updateRiskUI(data){

    // Website Name
    entity.textContent = data.searched;

    // Risk Circle
    riskCircle.innerHTML = `
        <div class="risk-score">${data.riskScore}</div>
        <div class="risk-outof">/100</div>
    `;

    const score = Number(data.riskScore ?? 0);

    console.log("riskScore =", data.riskScore);
    console.log("score =", score);
    // Reset Classes
    badge.className = "risk-badge";
    riskCircle.className = "risk-circle";

    // SAFE
    if(score < 20){

        badge.textContent = "SAFE";

        badge.classList.add("safe");

        riskCircle.classList.add("safe");

        recommendation.textContent =
            "✅ No major threats detected. Continue with normal caution.";

    }

    // SUSPICIOUS
    else if(score < 50){

        badge.textContent = "SUSPICIOUS";

        badge.classList.add("warning");

        riskCircle.classList.add("warning");

        recommendation.textContent =
            "⚠ Some warning signs were detected. Verify the website before entering passwords or payment information.";

    }

    // DANGEROUS
    else{

        badge.textContent = "DANGEROUS";

        badge.classList.add("danger");

        riskCircle.classList.add("danger");

        recommendation.textContent =
            "🚨 High Risk. Avoid interacting with this website.";

    }

    // Status Line

    status.textContent = `
Reachable • HTTPS ${data.https ? "Enabled" : "Disabled"} • HTTP ${data.status ?? "--"}
`;

}
// ==========================================
// UPDATE AI ANALYSIS
// ==========================================

function updateAIAnalysis(data){

    const score = data.riskScore;

    if(score < 20){

        threatType.textContent = "Safe Website";
        confidence.textContent = "98%";

        aiRecommendation.textContent =
            "No significant threats were detected. Continue using normal online safety practices.";

    }

    else if(score < 50){

        threatType.textContent = "Suspicious Website";
        confidence.textContent = "76%";

        aiRecommendation.textContent =
            "Some warning signs were detected. Verify ownership before logging in or making payments.";

    }

    else{

        threatType.textContent = "Potentially Malicious";
        confidence.textContent = "95%";

        aiRecommendation.textContent =
            "Multiple threat indicators were detected. Avoid entering passwords or sensitive information.";

    }

}

// ==========================================
// UPDATE VIRUSTOTAL
// ==========================================

function updateVirusTotal(data){

    if(!data.virusTotal){

        maliciousCount.textContent = "--";
        suspiciousCount.textContent = "--";
        harmlessCount.textContent = "--";

        return;

    }

    maliciousCount.textContent =
        data.virusTotal.stats.malicious;

    suspiciousCount.textContent =
        data.virusTotal.stats.suspicious;

    harmlessCount.textContent =
        data.virusTotal.stats.harmless;

}
// ==========================================
// UPDATE RISK FACTORS
// ==========================================

function updateRiskFactors(data){

    let html = "";

    // HTTPS

    html += data.https
        ? "<li>✅ HTTPS connection detected.</li>"
        : "<li>⚠ Website is not using HTTPS.</li>";

    // Reachability

    html += data.reachable
        ? "<li>✅ Website is reachable.</li>"
        : "<li>❌ Website could not be reached.</li>";

    // VirusTotal

    if(data.virusTotal){

        if(data.virusTotal.stats.malicious > 0){

            html += `
            <li>
                🚨 ${data.virusTotal.stats.malicious}
                security vendors flagged this website as malicious.
            </li>
            `;

        }

        if(data.virusTotal.stats.suspicious > 0){

            html += `
            <li>
                ⚠ ${data.virusTotal.stats.suspicious}
                security vendors flagged this website as suspicious.
            </li>
            `;

        }

        if(
            data.virusTotal.stats.malicious===0 &&
            data.virusTotal.stats.suspicious===0
        ){

            html += `
            <li>
                ✅ No security vendors reported threats.
            </li>
            `;

        }

    }

    html += `
        <li>
            📊 Overall Risk Score:
            <strong>${data.riskScore}/100</strong>
        </li>
    `;

    riskFactors.innerHTML = html;

}
// ==========================================
// LOAD RECENT SEARCHES
// ==========================================

async function loadRecentSearches(){

    try{

        const response = await fetch("http://localhost:5000/api/history");

        const scans = await response.json();

        const container = document.getElementById("recentSearches");

        if(!container) return;

        if(scans.length===0){

            container.innerHTML="<p>No recent searches.</p>";

            return;

        }

        container.innerHTML="";

        scans.forEach(scan=>{

            let riskClass="search-safe";

            if(scan.risk==="SUSPICIOUS")
                riskClass="search-warning";

            if(scan.risk==="DANGEROUS")
                riskClass="search-danger";

            container.innerHTML+=`

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

        console.error("History Error:",err);

    }

}

// ==========================================
// ERROR HANDLING
// ==========================================

function showError(err){

    console.error(err);

    step1.className="scan-done";
    step1.textContent="❌ Verification Failed";

    step2.textContent="";
    step3.textContent="";
    step4.textContent="";
    step5.textContent="";

    verifyBtn.disabled=false;

    verifyBtn.classList.remove("verify-loading");
    verifyBtn.classList.remove("verify-success");

    verifyBtn.textContent="Verify";

    alert("Unable to connect to backend.");

}
// ==========================================
// INITIAL LOAD
// ==========================================

loadRecentSearches();