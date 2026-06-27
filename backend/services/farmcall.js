import { getLocation } from "./geolocation.js";
import { getWeatherData } from "./weather.js";
import { getWeatherSummary } from "./weatherSummary.js";
import { getFarmerSummary } from "./farmerSummary.js";
import { textToSpeech } from "./text_to_speech.js";
import {makeCall} from "./makeCall.js";

export async function getFarmcall(req, res) {
    try {
        // 1. Extract query parameters
        const { village, mandal, district, pincode, state } = req.query;

        // 2. Build the address
        const address = [village, mandal, district, pincode, state]
            .filter(Boolean)
            .join(", ");

        // 3. Early Exit Guard: Ensure we actually have an address to look up
        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Missing location parameters. Please provide at least a village or district."
            });
        }

        let location_data;

        // 4. Testing Override for Singarapuram
        if (village?.toLowerCase() === "singarapuram") {
            location_data = {
                latitude: 12.635643387794994,
                longitude: 78.39592595273234
            };
        } else {
            location_data = await getLocation(address);
        }

        if (!location_data) {
            return res.status(404).json({
                success: false,
                message: `Location not found for: ${address}`
            });
        }
      
        // 5. Fetch Weather
        const weatherData = await getWeatherData(
            location_data.latitude,
            location_data.longitude
        );

        // 6. FIX: Add 'await' to get the actual string, not a Promise
        const weatherSummary = await getWeatherSummary(weatherData);

        // 7. Generate AI Script
        const farmerSummary = await getFarmerSummary(req, weatherSummary);

        // 8. Generate Audio
        const audioResult=await textToSpeech(farmerSummary);
        
        
        const callResult= await makeCall(req,audioResult.audioUrl);
        // 9. Send Success Response
        console.log(audioResult.audioUrl);
        return res.status(200).json({
            success: true,
            farmerSummary
        });

    } catch (error) {
        // Maximum traceability for the controller
        console.error("[FarmCall Controller - getFarmcall] Failed:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "An unexpected error occurred while generating the FarmCall."
        });
    }
}