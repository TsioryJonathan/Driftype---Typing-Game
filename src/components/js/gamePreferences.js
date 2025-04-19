function toggleGamePreferences() {
    const section = document.getElementById('game-preferences');
    if (section) {
        section.classList.toggle('hidden');
    }
}

function saveGamePreferences() {
    const preferences = {
        realTime: document.getElementById('realTimeToggle').checked,
        instantFeedback: document.getElementById('instantFeedbackToggle').checked,
    };
    localStorage.setItem('gamePreferences', JSON.stringify(preferences));
}

function loadGamePreferences() {
    const preferences = JSON.parse(localStorage.getItem('gamePreferences')) || {};
    const realEl = document.getElementById('realTimeToggle');
    if (realEl && 'realTime' in preferences) realEl.checked = preferences.realTime;
    const instantEl = document.getElementById('instantFeedbackToggle');
    if (instantEl && 'instantFeedback' in preferences) instantEl.checked = preferences.instantFeedback;
}

document.addEventListener('DOMContentLoaded', loadGamePreferences);
