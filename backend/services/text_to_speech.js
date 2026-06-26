import axios from "axios";

const VOICE_MAP = {
      english: {
        locale: "en-IN",
        voiceId: "en-IN-priya"
    },
    hindi: {
        voiceId: "Aditi",
        locale: "hi-IN"
    },
    tamil: {
        voiceId: "Iniya",
        locale: "ta-IN"
    },
    telugu: {
        voiceId: "Aditi",
        locale: "te-IN"
    },
    kannada: {
        voiceId: "Shruti",
        locale: "kn-IN"
    },
    malayalam: {
        voiceId: "Alia",
        locale: "ml-IN"
    }
  
};

export async function textToSpeech(text, req) {
    const language = req?.query?.language || "english";
    const config = VOICE_MAP[language.toLowerCase()] || "Natalie";

    try {
        const response = await axios.post(
            "https://api.murf.ai/v1/speech/generate",
            {
                  voiceId: config.voiceId,
                 locale: config.locale,
                   format: "MP3",
                text
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "api-key": process.env.MURF_API_KEY
                }
            }
        );
        // 👇 Add this temporarily
const test = await axios.get(response.data.audioFile);

console.log("Status:", test.status);
console.log("Content-Type:", test.headers["content-type"]);
console.log("Content-Length:", test.headers["content-length"]); 
    

        return {
            audioUrl: response.data.audioFile,
            source: "murf"
        };

    } catch (error) {
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);
        throw error;
    }
}