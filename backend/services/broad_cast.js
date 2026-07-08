import {getAllFarmers} from "../database/db.js";
import { makeCall } from "../services/makeCall.js";
export async function translateBroadcastMessage(message, farmerName, language) {
    try {
const prompt = `
You are an expert translator.

Translate the following message into ${language}.

Begin with a friendly greeting addressing ${farmerName} in a way that sounds natural for native speakers.

Then continue with the translated message.

Message:
${message}

Return only the final spoken message.
`;

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.5-flash-lite",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data = await response.json();

        return data.choices[0].message.content;

    } catch (err) {
        console.error(err);
        throw err;
    }
}
import axios from "axios";

const VOICE_MAP = {
    english: {
        locale: "en-IN",
        voiceId: "en-IN-priya"
    },
    hindi: {
        locale: "hi-IN",
        voiceId: "Aditi"
    },
    tamil: {
        locale: "ta-IN",
        voiceId: "Iniya"
    },
    telugu: {
        locale: "te-IN",
        voiceId: "Aditi"
    },
    kannada: {
        locale: "kn-IN",
        voiceId: "Shruti"
    },
    malayalam: {
        locale: "ml-IN",
        voiceId: "Alia"
    }
};

export async function textToSpeech(summary, language = "english") {

    
const config =
    VOICE_MAP[language?.trim().toLowerCase()] || VOICE_MAP.english;

    try {

        const response = await axios.post(
            "https://api.murf.ai/v1/speech/generate",
            {
                voiceId: config.voiceId,
                locale: config.locale,
                format: "MP3",
                text: summary
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "api-key": process.env.MURF_API_KEY
                }
            }
        );

        return {
            audioUrl: response.data.audioFile,
            source: "murf"
        };

    } catch (error) {

        console.error("TTS Error:", error.response?.data || error.message);

        throw error;
    }

}
export const createBroadcast = async (req, res) => {
    try {

        const { message } = req.body;

        const farmers = await getAllFarmers();

        const promises = [];

        for (const farmer of farmers) {

            promises.push(
                (async () => {

                    const translatedMessage = await translateBroadcastMessage(
                        message,
                        farmer.farmer_name,
                        farmer.language
                    );

                    const { audioUrl } = await textToSpeech(
                        translatedMessage,
                        farmer.language
                    );

                    return await makeCall(
                        farmer.phone_number,
                        audioUrl,
                        translatedMessage,
                        farmer.language,
                        farmer.farmer_name,"broadCast"
                    );

                })()
            );

        }

        const results = await Promise.all(promises);

        return res.status(200).json({
            success: true,
            results
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

