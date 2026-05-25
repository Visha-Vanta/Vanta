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

    try {
        // Doğrudan Google'a değil, kendi oluşturduğumuz gizli Vercel köprüsüne soruyoruz
        const response = await fetch('/api/vanta', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userText, prompt })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return `[Sistem Hatası]: ${data.error || "Bir şeyler ters gitti"}`;
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("VANTA Köprü Hatası:", error);
        return `[CRITICAL_FAULT]: ${error.message}`;
    }
}