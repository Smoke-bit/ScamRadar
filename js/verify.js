const verifyBtn = document.getElementById("verifyBtn");
const verifyInput = document.getElementById("verifyInput");

verifyBtn.addEventListener("click", verifyEntity);

function verifyEntity(){

    const value = verifyInput.value.trim();

    if(value===""){

        alert("Please enter something to verify.");

        return;

    }

    showDemoResult(value);

}

function showDemoResult(value){

    document.querySelector(".result-header h2").textContent = value;

    document.querySelector(".result-header p").textContent =
    "Verification completed.";

    document.querySelector(".risk-badge").textContent = "LOW RISK";

    document.querySelector(".risk-badge").classList.remove("neutral");

    document.querySelector(".risk-badge").style.background="#dcfce7";

    document.querySelector(".risk-badge").style.color="#15803d";

    document.querySelector(".risk-circle").textContent="8%";

    document.querySelector(".result-box h1").textContent="0";

}