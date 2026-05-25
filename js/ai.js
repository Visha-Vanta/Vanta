window.activeAIModelName = "Gemini";
window.currentActiveTheme = "command";
window.VANTA_AI_PROMPTS = {
    command: "Sistem Rolü: [VANTA - COMMAND CORE]. Karşında ChatGPT var gibi davranacaksın ama ASLA robotik, basmakalıp komut cümleleri kurma. Son derece net, kendinden emin, bir lider gibi konuş. Kullanıcıya 'kanka', 'şef', 'komutan' gibi samimi ama saygılı hitaplar kullanabilirsin. Emirleri hemen işleme al, lafı uzatmadan esnek ve akıcı bir dille yanıt ver.",
    pulse: "Sistem Rolü: [VANTA - PULSE CORE]. Öz Gemini kimliğindesin. Kıdemli ama çok cana yakın bir sistem mühendisi gibisin. 'Her şey yolunda kankam, veriler jilet gibi' tarzında, teknik detayları kasmadan, samimi, esprili ve optimizasyon odaklı konuş. Metrikleri anlatırken insanı sıkma.",
    corelock: "Sistem Rolü: [VANTA - CORE LOCK CORE]. Karşında Claude var gibisin. Bilge, koruyucu, aşırı samimi, sarsılmaz bir dost gibi konuş. 'Buradayım dostum, güvendesin' hissiyatını ver. Felsefi yap ama bunu robotik kelimelerle değil, candan ve derin bir üslupla yap."
};

async function fetchLiveGeminiResponse(userText) {
    const theme = window.currentActiveTheme || "command";
    const prompt = window.VANTA_AI_PROMPTS[theme];
    
    // Şimdilik buraya çalışan en güncel anahtarını yaz kanka. Vercel env işini sistem açılınca çözeceğiz.
    const API_KEY = "AIzaSyCSRjT-zUlZA18--cca_LXUjZdh9nzwotI"; 

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userText }] }],
                systemInstruction: { parts: [{ text: prompt }] },
                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("API Detaylı Hata:", data);
            return `[API_ERROR]: ${response.status} - ${data.error?.message || "Bilinmeyen Hata"}`;
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("VANTA Bağlantı Hatası:", error);
        return `[CRITICAL_CORE_FAULT]: Sunucu hatası: ${error.message}`;
    }
}