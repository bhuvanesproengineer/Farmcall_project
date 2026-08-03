import twilio from "twilio";
import dotenv from "dotenv";
import { storeCallLog } from "../database/db.js";

dotenv.config();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Store call data temporarily
export const callStore = {};

export async function makeCall(phone_number, audioUrl, farmerSummary, language, farmerName, callType, username) {
    let phoneNumber = phone_number ? String(phone_number).trim() : "";
    if (phoneNumber && !phoneNumber.startsWith("+")) {
        phoneNumber = `+91${phoneNumber}`;
    }
    const displayName = farmerName || "Farmer";
    console.log("Calling farmer:", phoneNumber, "User:", username);

    const safeAudioUrl = (audioUrl || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const statusCallbackUrl = `${baseUrl.replace(/\/+$/, "")}/api/call-status`;

    // Create an initial call log entry in MongoDB immediately
    let initialLog = null;
    try {
        initialLog = await storeCallLog(
            displayName,
            phoneNumber,
            "initiated",
            0,
            "pending",
            username
        );
    } catch (logErr) {
        console.error("Failed to store initial call log:", logErr.message);
    }

    try {
        const call = await client.calls.create({
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER,
            twiml: `
                <Response>
                    <Play>${safeAudioUrl}</Play>
                </Response>
            `,
            statusCallback: statusCallbackUrl,
            statusCallbackEvent: ["completed"],
            statusCallbackMethod: "POST"
        });

        // Store required data for callback
        callStore[call.sid] = {
            phoneNumber,
            farmerSummary,
            language,
            farmerName: displayName,
            callType,
            username,
            logId: initialLog ? initialLog._id : null
        };

        return {
            success: true,
            callSid: call.sid,
            logId: initialLog ? initialLog._id : null
        };

    } catch (error) {
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("Status:", error.status);
        console.error(error);

        // Update the log entry to "failed" if call placement failed
        if (initialLog) {
            try {
                initialLog.call_status = "failed";
                initialLog.sms_status = "failed";
                await initialLog.save();
            } catch (saveErr) {
                console.error("Failed to update log status to failed:", saveErr.message);
            }
        } else {
            try {
                await storeCallLog(
                    displayName,
                    phoneNumber,
                    "failed",
                    0,
                    "failed",
                    username
                );
            } catch (createErr) {
                console.error("Failed to record failed call log:", createErr.message);
            }
        }

        return {
            success: false,
            error: error.message
        };
    }
}