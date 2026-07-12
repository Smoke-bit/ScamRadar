// ===============================
// Database Loader
// ===============================

export async function getReports(){

    const response = await fetch("data/reports.json");

    const reports = await response.json();

    return reports;

}

// ===============================
// Community Stats
// ===============================

export async function getCommunityStats(){

    const reports = await getReports();

    return{

        totalReports: reports.length,

        totalMembers:0,

        verifiedWebsites:0

    };

}

// ===============================
// Top Threat
// ===============================

export async function getTopThreat(){

    const reports = await getReports();

    if(reports.length===0){

        return null;

    }

    const counts={};

    reports.forEach(report=>{

        counts[report.value]=(counts[report.value]||0)+1;

    });

    const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]);

    return{

        name:sorted[0][0],

        reports:sorted[0][1]

    };

}