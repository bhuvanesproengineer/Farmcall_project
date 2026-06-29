import dotenv from "dotenv";

dotenv.config();

export async function getShortMsg(
    farmerSummary,
    language = "English"
) {
    try {

        const examples = {
            English: `Rain: Evening

Spray: Morning/Afternoon
Irrigate: No
Harvest: No
Sow: Suitable
Cover: Required`,

            Telugu: `వర్షం: సాయంత్రం

పిచికారీ: ఉదయం/మధ్యాహ్నం
నీరు: వద్దు
కోత: వద్దు
విత్తనం: అనుకూలం
కవరింగ్: అవసరం`,

            Tamil: `மழை: மாலை

தெளிப்பு: காலை/மதியம்
நீர்ப்பாசனம்: வேண்டாம்
அறுவடை: வேண்டாம்
விதைப்பு: ஏற்றது
மூடுதல்: அவசியம்`,

            Hindi: `बारिश: शाम

छिड़काव: सुबह/दोपहर
सिंचाई: नहीं
कटाई: नहीं
बुवाई: उपयुक्त
सुरक्षा कवर: आवश्यक`,

            Kannada: `ಮಳೆ: ಸಂಜೆ

ಸಿಂಪಡಣೆ: ಬೆಳಗ್ಗೆ/ಮಧ್ಯಾಹ್ನ
ನೀರಾವರಿ: ಬೇಡ
ಕೊಯ್ಲು: ಬೇಡ
ಬಿತ್ತನೆ: ಅನುಕೂಲ
ಮುಚ್ಚುವುದು: ಅಗತ್ಯ`,

            Malayalam: `മഴ: വൈകുന്നേരം

തളിക്കൽ: രാവിലെ/ഉച്ച
ജലസേചനം: വേണ്ട
വിളവെടുപ്പ്: വേണ്ട
വിത്തിടൽ: അനുയോജ്യം
മൂടൽ: ആവശ്യമാണ്`
        };

        const example =
            examples[language] ||
            examples["English"];

        const prompt = `
You are FarmCall.

LANGUAGE:
${language}

FARMER ADVISORY:
${farmerSummary}

TASK:
Read the advisory carefully and extract only the final farming decisions.

Required fields:
1. Rain
2. Spray
3. Irrigate
4. Harvest
5. Sow
6. Cover


IMPORTANT RULES:
- Generate output ONLY in ${language}.
- Only extract decisions already present in the advisory.
- Do NOT generate new advice.
- Do NOT explain anything.
- No greeting.
- No thank you.
- First line must be "FarmCall Alert" translated into ${language}.
- Use exactly the same labels and format as the example.
- Translate both labels and values into ${language}.
- Put each field on a new line.
- Return only the SMS content.

REFERENCE FORMAT:
${example}
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
            const errorText = await response.text();

            throw new Error(
                `OpenRouter API Error (${response.status}): ${errorText}`
            );
        }

        const data = await response.json();

        if (
            !data?.choices?.[0]?.message?.content
        ) {
            throw new Error(
                "Invalid response structure from AI."
            );
        }

        return data.choices[0].message.content.trim();

    } catch (error) {

        console.error(
            "[getShortMsg Error]:",
            error.message
        );

        throw error;
    }
}