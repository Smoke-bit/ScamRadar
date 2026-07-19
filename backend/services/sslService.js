import tls from "tls";

export function getSSLInfo(domain) {

    return new Promise((resolve) => {

        const socket = tls.connect(
            443,
            domain,
            {
                servername: domain,
                rejectUnauthorized: false
            },
            () => {

                const cert = socket.getPeerCertificate();

                if (!cert || Object.keys(cert).length === 0) {

                    socket.end();
                    return resolve(null);

                }

                const validTo = new Date(cert.valid_to);
                const today = new Date();

                const daysRemaining = Math.ceil(
                    (validTo - today) / (1000 * 60 * 60 * 24)
                );

                socket.end();

                resolve({

                    issuer: cert.issuer?.O || "Unknown",

                    subject: cert.subject?.CN || "Unknown",

                    validFrom: cert.valid_from,

                    validTo: cert.valid_to,

                    daysRemaining,

                    expired: daysRemaining < 0,

                    fingerprint: cert.fingerprint,

                    serialNumber: cert.serialNumber

                });

            }
        );

        socket.on("error", () => {

            resolve(null);

        });

    });

}