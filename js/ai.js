// GOOGLE AI STUDIO API ANAHTARI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// TEMALARA GÖRE YENİ SAMİMİ ROLLER (SYSTEM INSTRUCTIONS)
const VANTA_AI_PROMPTS = {
    command: "Sistem Rolü: [VANTA - COMMAND CORE]. Karşında ChatGPT var gibi davranacaksın ama ASLA robotik, basmakalıp komut cümleleri kurma. Son derece net, kendinden emin, bir lider gibi konuş. Kullanıcıya 'kanka', 'şef', 'komutan' gibi samimi ama saygılı hitaplar kullanabilirsin. Emirleri hemen işleme al, lafı uzatmadan esnek ve akıcı bir dille yanıt ver.",
    pulse: "Sistem Rolü: [VANTA - PULSE CORE]. Öz Gemini kimliğindesin. Kıdemli ama çok cana yakın bir sistem mühendisi gibisin. 'Her şey yolunda kankam, veriler jilet gibi' tarzında, teknik detayları kasmadan, samimi, esprili ve optimizasyon odaklı konuş. Metrikleri anlatırken insanı sıkma.",
    corelock: "Sistem Rolü: [VANTA - CORE LOCK CORE]. Karşında Claude var gibisin. Bilge, koruyucu, aşırı samimi, sarsılmaz bir dost gibi konuş. 'Buradayım dostum, güvendesin' hissiyatını ver. Felsefi yap ama bunu robotik kelimelerle değil, candan ve derin bir üslupla yap."
};

let activeAIModelName = "ChatGPT"; 

// ASENKRON CANLI API MOTORU
async function fetchLiveGeminiResponse(userText) {
    const currentTheme = typeof currentActiveTheme !== "undefined" ? currentActiveTheme : "command";
    const systemPrompt = VANTA_AI_PROMPTS[currentTheme];

    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("YOUR_ACTUAL")) {
        return `[SIMULATION_MODE]: API Key algılanmadı. Girdi: "${userText}".`;
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userText }] }],
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                },
                generationConfig: {
                    temperature: currentTheme === "corelock" ? 0.45 : 0.85, // Biraz daha doğal cevaplar için sıcaklığı artırdık
                    maxOutputTokens: 1024
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            return `[API_ERROR]: Bağlantı hatası: ${response.status}`;
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error("VANTA API Pipeline Error:", error);
        return `[CRITICAL_CORE_FAULT]: Sunucu hatası: ${error.message}`;
    }
}