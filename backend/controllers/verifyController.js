import { checkVirusTotal } from "../services/virusTotalService.js";
import {
    detectInputType,
    verifyWebsite
} from "../services/verifierService.js";
import { saveScan } from "../utils/saveScan.js";

export async function verifyEntity(req, res) {

    const { input } = req.body;

    const type = detectInputType(input);

    let result = {};

    if (type === "website") {

        result = await verifyWebsite(input);

        const vt = await checkVirusTotal(input);

        result.virusTotal = vt;

        // Calculate Risk
        const { malicious, suspicious, harmless } = vt.stats;

        let risk = "SAFE";

        if (malicious >= 4) {
            risk = "DANGEROUS";
        } else if (malicious >= 1) {
            risk = "SUSPICIOUS";
        }

        result.risk = risk;

        // Save Scan
        saveScan({
            url: input,
            risk,
            reachable: result.reachable,
            https: result.https,
            status: result.status,
            malicious,
            suspicious,
            harmless,
            scanDate: new Date().toISOString()
        });

    }

    res.json({

        success: true,

        searched: input,

        type,

        ...result

    });

}