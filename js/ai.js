// Global tanımlamalar (Dosyaların birbirini tanıması için)
window.activeAIModelName = "Gemini";
window.currentActiveTheme = "command";
window.VANTA_AI_PROMPTS = {
    command: "Sen [VANTA - COMMAND CORE] olarak, ChatGPT gibi ama daha samimi ve lider bir dille cevap ver.",
    pulse: "Sen [VANTA - PULSE CORE] olarak, teknik detayları basit ve neşeli bir dille anlat.",
    corelock: "Sen [VANTA - CORE LOCK CORE] olarak, derin, felsefi ve koruyucu bir dost gibi konuş."
};

// API İsteği
async function fetchLiveGeminiResponse(userText) {
    const theme = window.currentActiveTheme;
    const prompt = window.VANTA_AI_PROMPTS[theme];
    
    // NOT: Anahtarı buraya yazmak yerine Vercel'den çekmeye çalışacağız ama 
    // çalışmazsa, geçici olarak anahtarını buraya tırnak içinde yapıştır.
    const API_KEY = "AIzaSyAzuw9n2-kvA2VM0-nqkK95m1vHtsiPUuY"; // <-- GEÇİCİ ANAHTAR, GÜVENLİ DEĞİL, SADECE TEST AMAÇLI

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userText }] }],
                systemInstruction: { parts: [{ text: prompt }] },
                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("VANTA API Hatası:", error);
        return "Sistem bağlantı hatası: " + error.message;
    }
}