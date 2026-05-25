let currentActiveTheme = "command";

function selectVantaTheme(themeKey) {
    currentActiveTheme = themeKey;

    // 1. FÜTÜRİSTİK PORTAL ANİMASYONUNU AKTİF ET (Tüm ekrana sarsılma/parlama verir)
    const viewport = document.getElementById("content-viewport-layout");
    if (viewport) {
        viewport.classList.remove("portal-transition-active");
        void viewport.offsetWidth; // Reflow: Animasyon tetikleyicisini zorla sıfırla
        viewport.classList.add("portal-transition-active");
    }

    // 2. CSS Sınıf Temizliği
    document.body.classList.remove("theme-command", "theme-pulse", "theme-corelock");
    
    // 3. Yeni Temaya Göre Kilitlenme
    if (themeKey === "command") {
        document.body.classList.add("theme-command");
        activeAIModelName = "ChatGPT";
    } else if (themeKey === "pulse") {
        document.body.classList.add("theme-pulse");
        activeAIModelName = "Gemini";
    } else if (themeKey === "corelock") {
        document.body.classList.add("theme-corelock");
        activeAIModelName = "Claude";
    }

    // 4. Kart Görünümlerini Eşitle
    document.querySelectorAll(".theme-card").forEach(card => card.classList.remove("active"));
    const selectedCard = document.getElementById(`card-${themeKey}`);
    if (selectedCard) selectedCard.classList.add("active");

    // 5. Ayarlar Sekmesini Yenile (Saçma dropdown yok, direkt canlı durumu yansıtacak)
    if (typeof renderCoresConfig === "function") {
        renderCoresConfig();
    }

    // 6. Sohbet Paneline Bildirim Bas
    injectThemeNotification();
}

function injectThemeNotification() {
    const messagesBox = document.getElementById("chat-messages");
    if (!messagesBox) return;

    const row = document.createElement("div");
    row.className = "msg-row system";
    row.innerHTML = `
        <div class="msg-bubble">
            <span class="prefix">VANTA [SYSTEM]:</span>
            <p>Sistem frekansı kaydırıldı. Canlı Yapay Zeka Rolü: <strong>${activeAIModelName} Modu</strong></p>
        </div>
    `;
    messagesBox.appendChild(row);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}