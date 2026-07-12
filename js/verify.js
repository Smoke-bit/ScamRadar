console.log("verify.js loaded");
const verifyBtn = document.getElementById("verifyBtn");

const verifyInput = document.getElementById("verifyInput");

verifyBtn.addEventListener("click", verify);

async function verify(){

    const input = verifyInput.value.trim();

    if(input===""){

        alert("Enter something to verify.");

        return;

    }

    try{

        const response = await fetch("http://localhost:5000/api/verify",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                input

            })

        });

        const data = await response.json();

        document.getElementById("entityName").textContent =
        data.searched;

        document.getElementById("verificationStatus").textContent =
        "Detected as: " + data.type;

        document.getElementById("riskBadge").textContent =
        data.type.toUpperCase();

        console.log(data);

    }

    catch(err){

        console.error(err);

    }

}