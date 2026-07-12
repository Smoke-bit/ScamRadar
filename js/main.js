import{

getCommunityStats,

getTopThreat

}

from "./database.js";

async function loadHero(){

    const container=document.getElementById("heroCards");

    const stats=await getCommunityStats();

    const threat=await getTopThreat();

    if(threat===null){

        container.innerHTML=`

        <div class="floating-card top-card">

            <h4>Platform Ready</h4>

            <p>

            Waiting for the first community report.

            </p>

        </div>

        <div class="floating-card right-card">

            <h4>Community</h4>

            <p>

            ${stats.totalReports} Reports

            </p>

            <p>

            ${stats.totalMembers} Members

            </p>

        </div>

        <div class="floating-card bottom-card">

            <h4>Top Threat</h4>

            <p>

            No reports yet.

            </p>

        </div>

        `;

        return;

    }

    container.innerHTML=`

    <div class="floating-card top-card">

        <span class="high-risk">

        MOST REPORTED

        </span>

        <h4>

        ${threat.name}

        </h4>

        <p>

        ${threat.reports} Reports

        </p>

    </div>

    <div class="floating-card right-card">

        <h4>

        Community

        </h4>

        <p>

        ${stats.totalReports} Reports

        </p>

        <p>

        ${stats.totalMembers} Members

        </p>

    </div>

    <div class="floating-card bottom-card">

        <h4>

        ScamRadar

        </h4>

        <p>

        Live Community Data

        </p>

    </div>

    `;

}

loadHero();