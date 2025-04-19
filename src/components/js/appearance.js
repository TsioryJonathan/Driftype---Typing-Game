function toggleAppearanceSettings() {
    const section = document.getElementById('appearance-settings');
    if (section) {
        section.classList.toggle('hidden');
    }
}

function saveAppearanceSettings() {
    const settings = {};
    const themeEl = document.getElementById('theme-select');
    if (themeEl) settings.theme = themeEl.value;
    const fontEl = document.getElementById('font-size-select');
    if (fontEl) settings.fontSize = fontEl.value;
    localStorage.setItem('appearanceSettings', JSON.stringify(settings));
    if (settings.fontSize) applyFontSize(settings.fontSize);
}

function loadAppearanceSettings() {
    const settings = JSON.parse(localStorage.getItem('appearanceSettings')) || {};
    if (settings.theme) {
        const themeEl = document.getElementById('theme-select');
        if (themeEl) themeEl.value = settings.theme;
    }
    if (settings.fontSize) {
        const fontEl = document.getElementById('font-size-select');
        if (fontEl) fontEl.value = settings.fontSize;
        applyFontSize(settings.fontSize);
    }
}

function applyFontSize(size) {
    const root = document.documentElement;
    switch (size) {
        case 'sm': root.style.fontSize = '14px'; break;
        case 'md': root.style.fontSize = '16px'; break;
        case 'lg': root.style.fontSize = '18px'; break;
        default: root.style.fontSize = '';
    }
}

if (document.readyState !== 'loading') {
    loadAppearanceSettings();
} else {
    document.addEventListener('DOMContentLoaded', loadAppearanceSettings);
}
