import axios from "axios";

function calculateAge(createdDate) {

    if (!createdDate) {
        return {
            years: 0,
            months: 0
        };
    }

    const created = new Date(createdDate);
    const today = new Date();

    let years = today.getFullYear() - created.getFullYear();
    let months = today.getMonth() - created.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    return {
        years,
        months
    };
}
export async function getDomainInfo(domain) {

    try {

        const { data } = await axios.get(`https://rdap.org/domain/${domain}`);

        // Find important dates
        const created = data.events?.find(
            event => event.eventAction === "registration"
        );

        const updated = data.events?.find(
            event => event.eventAction === "last changed"
        );

        const expires = data.events?.find(
            event => event.eventAction === "expiration"
        );

        // Find registrar
        const registrar = data.entities?.find(entity =>
            entity.roles?.includes("registrar")
        );

        return {

            domain: data.ldhName.toLowerCase(),

            registrar:
                registrar?.vcardArray?.[1]?.find(
                    item => item[0] === "fn"
                )?.[3] || "Unknown",

            created: created?.eventDate || null,

            age: calculateAge(created?.eventDate),

            updated: updated?.eventDate || null,

            expires: expires?.eventDate || null,

            status: data.status || [],

            nameservers:
                data.nameservers?.map(ns => ns.ldhName) || []

        };

    }

    catch (err) {

        console.error("RDAP Error:", err.message);

        return null;

    }

}