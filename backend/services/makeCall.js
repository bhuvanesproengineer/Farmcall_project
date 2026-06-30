import twilio from "twilio";
import dotenv from "dotenv";


dotenv.config();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Store call data temporarily
export const callStore = {};

export async function makeCall(req, audioUrl, farmerSummary,language,farmerName) {

    console.log("Twilio executed");

    const { phone_number } = req.query;

    const phoneNumber = `+91${phone_number}`;

    const safeAudioUrl = audioUrl
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    console.log("BASE_URL:", process.env.BASE_URL);
    console.log(
        "Callback URL:",
        `${process.env.BASE_URL}/api/call-status`
    );

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
            farmerName
        };

        console.log("Call SID:", call.sid);

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