import { getDomainInfo } from "../services/domainInfoService.js";
import { calculateRisk } from "../services/riskEngine.js";
import { getSSLInfo } from "../services/sslService.js";
import { checkVirusTotal } from "../services/virusTotalService.js";
import { analyzeUrl } from "../services/urlHeuristicsService.js";
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

        const domainInfo = await getDomainInfo(result.domain);

        result.domainInfo = domainInfo;

        // SSL Certificate
        const sslInfo = await getSSLInfo(result.domain);
        
        console.log("SSL INFO:", sslInfo);

        result.ssl = sslInfo;

        // URL Heuristics
        const urlAnalysis = analyzeUrl(input);

        result.urlHeuristics = urlAnalysis;
        console.log("BEFORE RISK ENGINE");
console.log(result);
        const analysis = calculateRisk(result, vt);

        result = {
            ...result,
            ...analysis
        };
        console.log("AFTER RISK ENGINE");
console.log(result);
            

        }



    console.log(result);

    res.json({
        success: true,
        searched: result.domain || input,
        type,
        ...result
    });

}