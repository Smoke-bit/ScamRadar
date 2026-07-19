import dns from "dns/promises";

export async function getDNSInfo(domain) {
    try {
        const [aRecords, aaaaRecords, mxRecords, nsRecords] = await Promise.allSettled([
            dns.resolve4(domain),
            dns.resolve6(domain),
            dns.resolveMx(domain),
            dns.resolveNs(domain)
        ]);

        return {
            ipv4:
                aRecords.status === "fulfilled"
                    ? aRecords.value
                    : [],

            ipv6:
                aaaaRecords.status === "fulfilled"
                    ? aaaaRecords.value
                    : [],

            mx:
                mxRecords.status === "fulfilled"
                    ? mxRecords.value.sort((a, b) => a.priority - b.priority)
                    : [],

            nameservers:
                nsRecords.status === "fulfilled"
                    ? nsRecords.value
                    : []
        };

    } catch {

        return null;

    }
}