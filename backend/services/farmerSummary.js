export async function getFarmerSummary(req, weatherSummary) {
    try {
      
        const { language = 'English', farmer_name = 'Farmer', village = 'your village' } = req.query;
const examples = {
  English: `Example:
Good morning Selvam. Rain is expected this evening in Singarapuram. Complete pesticide spraying in the morning itself. Since rain is expected today, there is no need to irrigate the field. Cover your crops and ensure water does not collect in the field. The coming days are expected to remain dry, making them suitable for harvesting. Rainfall may not be sufficient for sowing new seeds. Thank you.`,

  Telugu: `Example:
శుభోదయం సెల్వం గారు. సింగారపురంలో ఈ రోజు సాయంత్రం వర్షం వచ్చే అవకాశం ఉంది. కాబట్టి ఉదయాన్నే మందు పిచికారీ పూర్తి చేయండి. వర్షం వచ్చే అవకాశం ఉన్నందున ఈ రోజు పొలానికి నీరు పెట్టవద్దు. పంటను కప్పి ఉంచి పొలంలో నీరు నిలవకుండా చూడండి. రాబోయే రోజుల్లో వర్షం తక్కువగా ఉండే అవకాశం ఉన్నందున కోతకు అనుకూలంగా ఉంటుంది. విత్తనాలు వేయడానికి మాత్రం ఇది సరైన సమయం కాదు. ధన్యవాదాలు.`,

  Tamil: `Example:
வணக்கம் செல்வம் அண்ணா. இன்று மதனப்பள்ளி பகுதியில் மழை வர வாய்ப்பு இருக்கு. அதனால் மருந்து தெளிக்கணும்னா காலையிலேயே முடிச்சுக்கோங்க. இன்று வயலுக்கு தண்ணீர் விட தேவையில்லை. பயிர்களை பாதுகாப்பாக மூடி வையுங்கள், வயலில் தண்ணீர் தேங்காம பார்த்துக்கோங்க. அடுத்த சில நாட்களிலும் மழை வர வாய்ப்பு இருப்பதால் அறுவடையை கொஞ்சம் தள்ளி வைப்பது நல்லது. இந்த மழையை பயன்படுத்தி விதைப்பு செய்யலாம். நன்றி.`,

  Hindi: `Example:
नमस्ते रमेश जी। आज शाम आपके गांव में बारिश होने की संभावना है। इसलिए सुबह ही दवा का छिड़काव पूरा कर लें। बारिश की संभावना होने के कारण आज सिंचाई न करें। फसल को ढककर रखें और खेत में पानी जमा न होने दें। आने वाले दिनों में बारिश कम रहने की संभावना है, इसलिए कटाई के लिए समय अनुकूल रहेगा। लेकिन नई बुवाई के लिए यह सही समय नहीं है। धन्यवाद।`,

  Kannada: `Example:
ಶುಭೋದಯ ರಮೇಶ್ ಅವರೆ. ಇಂದು ಸಂಜೆ ನಿಮ್ಮ ಗ್ರಾಮದಲ್ಲಿ ಮಳೆ ಬೀಳುವ ಸಾಧ್ಯತೆ ಇದೆ. ಆದ್ದರಿಂದ ಬೆಳಿಗ್ಗೆಯೇ ಔಷಧಿ ಸಿಂಪಡಿಸುವ ಕೆಲಸ ಮುಗಿಸಿಕೊಳ್ಳಿ. ಮಳೆಯ ಸಾಧ್ಯತೆ ಇರುವುದರಿಂದ ಇಂದು ನೀರಾವರಿ ಮಾಡಬೇಡಿ. ಬೆಳೆಗಳನ್ನು ಮುಚ್ಚಿ ಇಟ್ಟು ಹೊಲದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ. ಮುಂದಿನ ದಿನಗಳಲ್ಲಿ ಮಳೆ ಕಡಿಮೆ ಇರುವ ಸಾಧ್ಯತೆ ಇರುವುದರಿಂದ ಕೊಯ್ಲಿಗೆ ಇದು ಸೂಕ್ತ ಸಮಯವಾಗಿರುತ್ತದೆ. ಆದರೆ ಬೀಜ ಬಿತ್ತನೆಗೆ ಇದು ಸರಿಯಾದ ಸಮಯವಲ್ಲ. ಧನ್ಯವಾದಗಳು.`,

  Malayalam: `Example:
സുപ്രഭാതം രമേഷ് ചേട്ടാ. ഇന്ന് വൈകുന്നേരം നിങ്ങളുടെ ഗ്രാമത്തിൽ മഴയ്ക്ക് സാധ്യതയുണ്ട്. അതിനാൽ രാവിലെ തന്നെ മരുന്ന് തളിക്കൽ പൂർത്തിയാക്കുക. മഴയ്ക്ക് സാധ്യതയുള്ളതിനാൽ ഇന്ന് നനയ്ക്കേണ്ടതില്ല. വിളകൾ മൂടി സൂക്ഷിക്കുകയും വയലിൽ വെള്ളം കെട്ടിക്കിടക്കാതിരിക്കാൻ ശ്രദ്ധിക്കുകയും ചെയ്യുക. വരാനിരിക്കുന്ന ദിവസങ്ങളിൽ മഴ കുറവായിരിക്കാനിടയുള്ളതിനാൽ വിളവെടുപ്പിന് ഇത് അനുയോജ്യമായ സമയമാണ്. എന്നാൽ പുതിയ വിത്ത് വിതയ്ക്കാൻ ഇത് അനുയോജ്യമായ സമയമല്ല. നന്ദി.`
};

const example = examples[language] || examples["English"];

// If you are migrating this module to your Python/FastAPI backend, 
// you can easily convert this backtick string into a Python f-string.
const prompt = `You are FarmCall, an experienced agricultural extension officer calling a farmer on the phone.

CONTEXT:
Farmer Name: ${farmer_name}
Village: ${village}
Language: ${language}

WEATHER AND FARM ADVISORY DATA:
${weatherSummary}

TASK:
Analyze the weather and advisory data. Create a natural, conversational voice-call script strictly following this exact sequence:
1. Greet the farmer by name (e.g., "Good morning, ${farmer_name}").
2. State today's weather specifically for ${village}.
3. Explain the rain status (when and if it will rain).
4. Give the pesticide spraying recommendation.
5. Give the irrigation recommendation.
6. Advise whether to cover crops or protect from water.
7. Advise if it is a good time to harvest.
8. Advise if it is a good time to sow seeds.
9. End the call with a simple "Thank you".

IMPORTANT RULES:
- Generate the entire message ONLY in ${language}.
- Speak directly to the farmer as a friendly local officer.
- Connect the advice naturally with reasons (e.g., "Because it will rain today, do not irrigate").
- Use simple, everyday spoken words that rural farmers easily understand.
- STRICTLY PROHIBITED: Bullet points, headings, labels, line breaks between points, or technical jargon. Write it as ONE continuous spoken paragraph.
- Maximum length: 60-80 words.
- Return ONLY the final voice-call script. Do not include introductory notes or translations.

REFERENCE EXAMPLE (Follow this tone and format):
${example}
`;
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
                messages: [{
                    role: "user",
                    content: prompt
                }]
            })
        });

     if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API Error (${response.status}): ${errorText}`);
        }
        
        const data = await response.json();
        
        // Safely extract the text in one line. If anything is missing, it fails safely.
        if (!data?.choices?.[0]?.message?.content) {
            throw new Error("Invalid response structure from AI.");
        }

        return data.choices[0].message.content;

    } catch (error) {
        console.error("[getFarmerSummary Error]:", error.message);
        throw error; // Throwing it up to the controller to cancel the call
    }

}