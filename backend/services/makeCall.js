import twilio from "twilio";
import dotenv from "dotenv";


dotenv.config();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Store call data temporarily
export const callStore = {};

export async function makeCall(phone_number, audioUrl, farmerSummary, language, farmerName, callType) {




    let phoneNumber = phone_number ? String(phone_number).trim() : "";
    if (phoneNumber && !phoneNumber.startsWith("+")) {
        phoneNumber = `+91${phoneNumber}`;
    }
    console.log("Calling farmer:", phoneNumber);

    const safeAudioUrl = (audioUrl || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");




    try {

        const call = await client.calls.create({
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER,
            twiml: `
                <Response>
                    <Play>${safeAudioUrl}</Play>
                </Response>
            `,
            statusCallback: `${process.env.BASE_URL}/api/call-status`,
            statusCallbackEvent: ["completed"],
            statusCallbackMethod: "POST"
        });

        // Store required data for callback
        callStore[call.sid] = {
            phoneNumber,
            farmerSummary,
            language,
            farmerName, callType
        };


        return {
            success: true,
            callSid: call.sid
        };

    } catch (error) {

        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("Status:", error.status);
        console.error(error);

        return {
            success: false,
            error: error.message
        };
    }
}