export async function verifyEntity(req, res){

    const { input } = req.body;

    res.json({

        success: true,

        searched: input,

        type: "unknown",

        risk: "Unknown",

        score: 0,

        reports: 0

    });

}