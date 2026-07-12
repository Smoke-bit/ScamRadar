// =====================================
// Temporary Community Data
// =====================================

const reports=[];

const members=0;

const verified=0;

// =====================================

const leaderboard=document.getElementById("leaderboard-content");

const activity=document.getElementById("activity-content");

const status=document.getElementById("status-content");

// =====================================

if(reports.length===0){

leaderboard.innerHTML=`

<p>

No trending threats yet.

</p>

<p>

<strong>Be the first to report one.</strong>

</p>

`;

}

else{

leaderboard.innerHTML=`

<p>

🥇 ${reports[0].name}

</p>

<p>

${reports[0].count} Reports

</p>

`;

}

// =====================================

activity.innerHTML=`

<p><strong>${reports.length}</strong> Reports</p>

<p><strong>${members}</strong> Members</p>

<p><strong>${verified}</strong> Verified Websites</p>

`;

// =====================================

status.innerHTML=`

<p>

Platform ready.

</p>

<p>

Waiting for the first community submission.

</p>

`;