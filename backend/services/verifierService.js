import axios from "axios";

export function detectInputType(input) {

    input = input.trim();

    // Website
    try {

        const url = new URL(
            input.startsWith("http") ? input : "https://" + input
        );

        if (url.hostname.includes(".")) {
            return "website";
        }

    }

    catch {}

    // Email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
        return "email";
    }

    // Phone
    if (/^\+?\d{10,15}$/.test(input)) {
        return "phone";
    }

    // UPI
    if (/^[\w.-]+@[\w]+$/.test(input)) {
        return "upi";
    }

    return "unknown";

}

export async function verifyWebsite(input) {

    try {

        // Add protocol if missing
        if (!input.startsWith("http://") && !input.startsWith("https://")) {
            input = "https://" + input;
        }

        const parsed = new URL(input);

        // Domain for VirusTotal
        const domain = parsed.hostname.replace(/^www\./, "");

        // Only check the website origin
        const website = parsed.origin;

        const response = await axios.get(website, {
            timeout: 5000,
            maxRedirects: 5
        });

        return {

            reachable: true,
            status: response.status,
            https: parsed.protocol === "https:",
            domain

        };

    }

    catch (err) {

        // Even if request fails, try extracting the domain
        try {

            const parsed = new URL(
                input.startsWith("http") ? input : "https://" + input
            );

            return {

                reachable: false,
                status: err.response?.status || null,
                https: parsed.protocol === "https:",
                domain: parsed.hostname.replace(/^www\./, "")

            };

        }

        catch {

            return {

                reachable: false,
                status: null,
                https: false,
                domain: null

            };

        }

    }

}