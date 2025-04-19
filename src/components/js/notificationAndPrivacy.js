function toggleNotificationAndPrivacy() {
    const section = document.getElementById('notification-privacy');
    if (section) {
        section.classList.toggle('hidden');
    }
}

function saveNotificationAndPrivacySettings() {
    const settings = {
        notifications: document.getElementById('notifications-toggle').checked,
        privacy: document.getElementById('privacy-toggle').checked,
    };
    localStorage.setItem('notificationPrivacySettings', JSON.stringify(settings));
}

function loadNotificationAndPrivacySettings() {
    const settings = JSON.parse(localStorage.getItem('notificationPrivacySettings'));
    if (settings) {
        document.getElementById('notifications-toggle').checked = settings.notifications;
        document.getElementById('privacy-toggle').checked = settings.privacy;
    }
}

document.addEventListener('DOMContentLoaded', loadNotificationAndPrivacySettings);
