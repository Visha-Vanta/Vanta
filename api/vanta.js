// api/vanta.js
module.exports = async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Sadece POST istekleri kabul edilir.' });
    }

    const { userText, prompt } = request.body;
    const API_KEY = process.env.GEMINI_API_KEY; 

    if (!API_KEY) {
        return response.status(500).json({ error: 'Sunucuda GEMINI_API_KEY tanımlı değil!' });
    }

    try {
        const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userText }] }],
                systemInstruction: { parts: [{ text: prompt }] },
                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
            })
        });

        const data = await googleResponse.json();
        return response.status(200).json(data);
    } catch (error) {
        return response.status(500).json({ error: 'Google API bağlantı hatası: ' + error.message });
    }
}