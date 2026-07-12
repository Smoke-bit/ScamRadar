export function detectInputType(input){

    input = input.trim();

    // Website
    if(/^https?:\/\/|^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input)){
        return "website";
    }

    // Email
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)){
        return "email";
    }

    // Phone Number
    if(/^\+?\d{10,15}$/.test(input)){
        return "phone";
    }

    // UPI ID
    if(/^[\w.-]+@[\w]+$/.test(input)){
        return "upi";
    }

    return "unknown";

}