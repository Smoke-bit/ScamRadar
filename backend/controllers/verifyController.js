import {
    detectInputType,
    verifyWebsite
} from "../services/verifierService.js";

export async function verifyEntity(req, res) {

    const { input } = req.body;

    const type = detectInputType(input);

    let result = {};

    if (type === "website") {
        result = await verifyWebsite(input);
    }

    res.json({

        success: true,

        searched: input,

        type,

        ...result

    });

}