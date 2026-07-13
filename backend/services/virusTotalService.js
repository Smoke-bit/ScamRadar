import axios from "axios";

export async function checkVirusTotal(domain) {
    console.log("VT KEY =", process.env.VIRUSTOTAL_API_KEY);
    try {

        const response = await axios.get(

            `https://www.virustotal.com/api/v3/domains/${domain}`,

            {

                headers: {

                    "x-apikey": process.env.VIRUSTOTAL_API_KEY

                }

            }

        );

        const data = response.data.data.attributes;

        return {

            reputation: data.reputation,

            stats: data.last_analysis_stats,

            votes: data.total_votes,

            categories: data.categories

        };

    }

    catch (err) {

        console.error(err.response?.data || err.message);

        return null;

    }

}
