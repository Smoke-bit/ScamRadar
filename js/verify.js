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

        console.log(data);

    }

    catch(err){

        console.error(err);

    }

}