import axios from "axios";

export function detectInputType(input) {

    input = input.trim();

    if (/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(input)) {
        return "website";
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
        return "email";
    }

    if (/^\+?\d{10,15}$/.test(input)) {
        return "phone";
    }

    if (/^[\w.-]+@[\w]+$/.test(input)) {
        return "upi";
    }

    return "unknown";
}

export async function verifyWebsite(url) {

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    try {

        const response = await axios.get(url, {
            timeout: 5000
        });

        return {
            reachable: true,
            status: response.status,
            https: url.startsWith("https")
        };

    } catch {

        return {
            reachable: false,
            status: null,
            https: url.startsWith("https")
        };

    }
}