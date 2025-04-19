function toggleNotificationAndPrivacy() {
    const section = document.getElementById('notification-privacy');
    if (section) {
        section.classList.toggle('hidden');
    }
}

function saveNotificationAndPrivacySettings() {
    const settings = {
        notifications: document.getElementById('pushNotificationsToggle')?.checked,
        profileVisible: document.getElementById('profileVisibleToggle')?.checked,
        activityStatus: document.getElementById('activityStatusToggle')?.checked,
    };
    localStorage.setItem('notificationPrivacySettings', JSON.stringify(settings));
    updateAvatarStatusIndicators();
}

function loadNotificationAndPrivacySettings() {
    const settings = JSON.parse(localStorage.getItem('notificationPrivacySettings')) || {};
    // Apply toggles
    const pushEl = document.getElementById('pushNotificationsToggle');
    if (pushEl && 'notifications' in settings) pushEl.checked = settings.notifications;
    const profileEl = document.getElementById('profileVisibleToggle');
    if (profileEl && 'profileVisible' in settings) profileEl.checked = settings.profileVisible;
    const activityEl = document.getElementById('activityStatusToggle');
    if (activityEl && 'activityStatus' in settings) activityEl.checked = settings.activityStatus;
    // Background music handled in soundAndFeedback.js
    // Update avatar indicators
    updateAvatarStatusIndicators();
}

// Update avatar status markers across pages
function updateAvatarStatusIndicators() {
    const settings = JSON.parse(localStorage.getItem('notificationPrivacySettings')) || {};
    const isVisible = settings.profileVisible;
    const isActive = settings.activityStatus;
    document.querySelectorAll('#avatar-img').forEach(img => {
        const container = img.parentElement;
        if (container) container.style.position = 'relative';
        // Remove existing indicators
        container.querySelectorAll('.visible-indicator, .activity-indicator').forEach(el => el.remove());
        if (isVisible) {
            const eye = document.createElement('i');
            eye.className = 'fa fa-eye visible-indicator';
            eye.style.cssText = 'position:absolute;top:0;left:0;background:rgba(234,179,8,0.8);color:white;padding:2px;border-radius:50%;font-size:10px;';
            container.appendChild(eye);
        }
        if (isActive) {
            const dot = document.createElement('span');
            dot.className = 'activity-indicator';
            dot.style.cssText = 'position:absolute;bottom:0;right:0;width:10px;height:10px;background:limegreen;border:2px solid white;border-radius:50%;';
            container.appendChild(dot);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadNotificationAndPrivacySettings();
});
