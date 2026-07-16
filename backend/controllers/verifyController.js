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

        // Verify website
        result = await verifyWebsite(input);

        // Check VirusTotal
        const vt = await checkVirusTotal(result.domain);

        result.virusTotal = vt;

        // ===============================
        // ScamRadar Risk Engine v1
        // ===============================

        if (vt && vt.stats) {

            const { malicious, suspicious } = vt.stats;

            let riskScore = 0;

            // VirusTotal detections
            riskScore += malicious * 25;
            riskScore += suspicious * 10;

            // HTTPS
            if (!result.https) {
                riskScore += 15;
            }

            // Website unreachable
            if (!result.reachable) {
                riskScore += 10;
            }

            // Reputation
            if (typeof vt.reputation === "number" && vt.reputation < 0) {
                riskScore += 15;
            }

            // Limit score to 100
            riskScore = Math.min(riskScore, 100);

            // Decide Risk Label
            let risk = "SAFE";

            if (riskScore >= 50) {
                risk = "DANGEROUS";
            }
            else if (riskScore >= 20) {
                risk = "SUSPICIOUS";
            }

            result.risk = risk;
            result.riskScore = riskScore;

            /*
            saveScan({
                url: input,
                risk,
                reachable: result.reachable,
                https: result.https,
                status: result.status,
                malicious,
                suspicious,
                harmless: vt.stats.harmless,
                scanDate: new Date().toISOString()
            });
            */

        }

        else {

            // VirusTotal returned nothing useful
            result.risk = "UNKNOWN";
            result.riskScore = 0;

            result.virusTotal = {
                stats: {
                    malicious: 0,
                    suspicious: 0,
                    harmless: 0
                }
            };

        }

    }

    console.log(result);

    res.json({
        success: true,
        searched: result.domain || input,
        type,
        ...result
    });

}