// SİSTEMİN AÇILIŞ DİZİLİMİ
document.addEventListener("DOMContentLoaded", () => {
    runVantaBootSequence();
    renderCoresConfig();
});

// SIDEBAR HAMBURGER MENÜ DETEKTÖRÜ
function toggleSidebar() {
    const sidebar = document.getElementById("main-sidebar");
    if (sidebar) sidebar.classList.toggle("collapsed");
}

// BOOT SEKANSI VE LOGIN GEÇİŞİ
function runVantaBootSequence() {
    setTimeout(() => {
        const bootStatusText = document.querySelector(".dynamic-engine-text");
        if (bootStatusText) {
            bootStatusText.textContent = "GEMINI_2_5_FLASH: SUCCESS";
            bootStatusText.style.color = "#22c55e";
        }
    }, 1200);

    setTimeout(() => {
        const bootScreen = document.getElementById("boot-screen");
        const loginScreen = document.getElementById("login-screen");
        if (bootScreen) bootScreen.classList.add("hidden");
        if (loginScreen) loginScreen.classList.remove("hidden");
    }, 2500);
}

// KİMLİK DOĞRULAMA
function handleAuth(providerName) {
    document.getElementById("current-auth-mode").textContent = providerName.toUpperCase();
    document.getElementById("avatar-initials").textContent = "YD";
    enterApplication();
}

function handleGuestLogin() {
    document.getElementById("current-auth-mode").textContent = "GUEST";
    document.getElementById("avatar-initials").textContent = "MS";
    enterApplication();
}

function enterApplication() {
    const gateway = document.getElementById("gateway-container");
    const app = document.getElementById("app-container");
    if (gateway) gateway.classList.add("hidden");
    if (app) app.classList.remove("hidden");
}

// SEKMELER ARASI GEÇİŞ
function switchSection(sectionId) {
    document.querySelectorAll(".section-pane").forEach(pane => pane.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));

    const targetPane = document.getElementById(sectionId);
    if (targetPane) targetPane.classList.add("active");

    if (sectionId === 'chat-section') document.getElementById("nav-chat").classList.add("active");
    if (sectionId === 'themes-section') document.getElementById("nav-themes").classList.add("active");
    if (sectionId === 'settings-section') document.getElementById("nav-settings").classList.add("active");
}

// CORES CONFIG ALANI (MANTIK HATASI DÜZELTİLDİ: ARTIK SEÇİM DEĞİL, GÖSTERGE ALANI)
function renderCoresConfig() {
    const configContainer = document.getElementById("cores-config-list");
    if (!configContainer) return;

    const currentModelLabel = typeof activeAIModelName !== "undefined" ? activeAIModelName : "ChatGPT";
    const currentThemeKey = typeof currentActiveTheme !== "undefined" ? currentActiveTheme : "command";

    configContainer.innerHTML = `
        <div class="config-row">
            <div class="config-label">
                <h5>Aktif Çekirdek Yapısı</h5>
                <p>Mevcut tema sürümüne kenetlenmiş yapay zeka modülasyonu</p>
            </div>
            <div class="config-control">
                <div class="status-badge-view">${currentModelLabel.toUpperCase()} MODE</div>
            </div>
        </div>
        <div class="config-row">
            <div class="config-label">
                <h5>Sistem Sıcaklığı (Temperature)</h5>
                <p>Çekirdeğin yaratıcılık ve sapma katman ayarı</p>
            </div>
            <div class="config-control">
                <input type="text" value="${currentThemeKey === 'corelock' ? '0.35' : '0.75'}" readonly style="width:65px; text-align:center; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; padding:6px; border-radius:4px; font-family:'Fira Code', monospace; font-weight:bold;">
            </div>
        </div>
    `;
}

// ASENKRON GERÇEK MESAJLAŞMA MOTORU
async function sendMessage() {
    const field = document.getElementById("user-input-field");
    const text = field.value.trim();
    if (!text) return;

    const box = document.getElementById("chat-messages");
    
    // 1. Kullanıcı Balonunu Ekrana Bas
    const uRow = document.createElement("div");
    uRow.className = "msg-row user";
    uRow.innerHTML = `<div class="msg-bubble"><p>${text}</p></div>`;
    box.appendChild(uRow);
    
    field.value = "";
    box.scrollTop = box.scrollHeight;

    // 2. "VANTA Düşünüyor..." Yükleme İndikatörünü Çalıştır
    const thinkingRow = document.createElement("div");
    thinkingRow.className = "msg-row system";
    thinkingRow.id = "vanta-interim-thinking";
    thinkingRow.innerHTML = `
        <div class="msg-bubble">
            <span class="prefix">VANTA [SYSTEM]:</span>
            <p class="vanta-thinking-text">Veri ağlarına erişiliyor, yanıt derleniyor...</p>
        </div>
    `;
    box.appendChild(thinkingRow);
    box.scrollTop = box.scrollHeight;

    // 3. Gerçek Canlı API İsteğini Ateşle
    const aiResponseText = await fetchLiveGeminiResponse(text);

    // 4. Yükleme Balonunu Kaldır ve Gerçek Yanıtı Yapıştır
    const loader = document.getElementById("vanta-interim-thinking");
    if (loader) loader.remove();

    const sRow = document.createElement("div");
    sRow.className = "msg-row system";
    
    const modelLabel = typeof activeAIModelName !== "undefined" ? activeAIModelName : "VANTA";

    sRow.innerHTML = `
        <div class="msg-bubble">
            <span class="prefix">VANTA [${modelLabel.toUpperCase()}]:</span>
            <p>${aiResponseText.replace(/\n/g, '<br>')}</p>
        </div>
    `;
    box.appendChild(sRow);
    box.scrollTop = box.scrollHeight;
}