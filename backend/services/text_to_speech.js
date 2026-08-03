import axios from "axios";

const VOICE_MAP = {
  english: {
    voiceId: "Natalie",
    locale: "en-IN",
    style: "Newscast Casual"
  },
  hindi: {
    voiceId: "Natalie",
    locale: "hi-IN",
    style: "Newscast Casual"
  },
  telugu: {
    voiceId: "Natalie",
    locale: "te-IN",
    style: "Newscast Casual"
  },
  tamil: {
    voiceId: "Natalie",
    locale: "ta-IN",
    style: "Newscast Casual"
  },
  kannada: {
    voiceId: "Natalie",
    locale: "kn-IN",
    style: "Newscast Casual"
  },
  malayalam: {
    voiceId: "Natalie",
    locale: "ml-IN",
    style: "Newscast Casual"
  }
};

export async function textToSpeech(text, language) {
  console.log(language);
  console.log(text);

  const config = VOICE_MAP[language.toLowerCase()] || "Natalie";


  try {
    const response = await axios.post(
      "https://api.murf.ai/v1/speech/generate",
      {
        voiceId: config.voiceId,
        locale: config.locale,
        style: config.style,
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