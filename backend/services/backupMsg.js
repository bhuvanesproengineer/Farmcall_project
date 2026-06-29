import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export async function backupMsg(
    status,
    duration,
    phoneNumber,
    farmerSummary
) {
    try {

        if (
            status !== "completed" ||
            duration < 10
        ) {
const shortSummary =
    farmerSummary.length > 500
        ? farmerSummary.substring(0, 500)
        : farmerSummary;
            console.log("SMS TEXT:");
console.log(shortSummary);
console.log("SMS LENGTH:", shortSummary.length);

            const message = await client.messages.create({
                body: shortSummary,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber
            });

            console.log("✅ SMS Sent");
            console.log("Message SID:", message.sid);

            return {
                success: true,
                smsSent: true
            };
        }

        console.log("✅ No SMS Required");

        return {
            success: true,
            smsSent: false
        };

    } catch (error) {

        console.error("SMS Error:", error);

        return {
            success: false,
            smsSent: false
        };
    }
}