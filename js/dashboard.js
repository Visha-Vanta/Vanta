async function sendMessage() {
    const field = document.getElementById("user-input-field");
    if (!field) return;
    
    const text = field.value.trim();
    if (!text) return;

    const box = document.getElementById("chat-messages");
    if (!box) return;
    
    // 1. Kullanıcı Mesajını Ekrana Bas
    const uRow = document.createElement("div");
    uRow.className = "msg-row user";
    uRow.innerHTML = `<div class="msg-bubble"><p>${text}</p></div>`;
    box.appendChild(uRow);
    field.value = "";
    box.scrollTop = box.scrollHeight;

    // 2. Yükleme Balonunu Ekle (Takılı kalmayı önlemek için ID verdik)
    const loader = document.createElement("div");
    loader.className = "msg-row system";
    loader.id = "vanta-interim-thinking";
    loader.innerHTML = `<div class="msg-bubble"><p>Veri ağlarına erişiliyor...</p></div>`;
    box.appendChild(loader);
    box.scrollTop = box.scrollHeight;

    // 3. API'den Yanıt Bekle
    const aiResponseText = await fetchLiveGeminiResponse(text);
    
    // 4. Yükleme Balonunu Ortadan Kaldır
    const currentLoader = document.getElementById("vanta-interim-thinking");
    if (currentLoader) {
        currentLoader.remove();
    }

    // 5. VANTA'nın Cevabını Ekrana Bas
    const sRow = document.createElement("div");
    sRow.className = "msg-row system";
    sRow.innerHTML = `<div class="msg-bubble"><p>${aiResponseText.replace(/\n/g, '<br>')}</p></div>`;
    box.appendChild(sRow);
    box.scrollTop = box.scrollHeight;
}