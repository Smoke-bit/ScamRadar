console.log("verify.js loaded");

const verifyBtn = document.getElementById("verifyBtn");
const verifyInput = document.getElementById("verifyInput");

verifyBtn.addEventListener("click", verify);

async function verify() {

    const input = verifyInput.value.trim();

    if (input === "") {
        alert("Enter something to verify.");
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/api/verify", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                input
            })

        });

        const data = await response.json();

        console.log(data);

        // Update searched entity
        const entity = document.getElementById("entityName");
        const badge = document.getElementById("riskBadge");
        const status = document.getElementById("verificationStatus");

        console.log(entity);
        console.log(badge);
        console.log(status);

        // Elements
        const badge = document.getElementById("riskBadge");
        const status = document.getElementById("verificationStatus");

        // Website verification
        if (data.type === "website") {

            if (data.reachable) {

                badge.textContent = "SAFE";
                badge.className = "risk-badge safe";

                status.textContent =
                    `Website is reachable • HTTP ${data.status}`;

            } else {

                badge.textContent = "WARNING";
                badge.className = "risk-badge warning";

                status.textContent =
                    "Website could not be reached.";

            }

        }

        // Other types
        else {

            badge.textContent = data.type.toUpperCase();
            badge.className = "risk-badge neutral";

            status.textContent =
                `Detected as ${data.type}`;

        }

    }

    catch (err) {

        console.error(err);
        alert("Unable to connect to backend.");

    }

}