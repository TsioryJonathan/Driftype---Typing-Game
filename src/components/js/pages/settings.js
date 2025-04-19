// settings.js: centralize all settings change handlers

document.addEventListener('DOMContentLoaded', () => {
  // Game Preferences
  const realEl = document.getElementById('realTimeToggle');
  if (realEl) realEl.addEventListener('change', saveGamePreferences);
  const instantEl = document.getElementById('instantFeedbackToggle');
  if (instantEl) instantEl.addEventListener('change', saveGamePreferences);

  // Sound & Feedback
  const enableSoundsEl = document.getElementById('enableSoundsToggle');
  if (enableSoundsEl) enableSoundsEl.addEventListener('change', saveSoundAndFeedbackSettings);
  const keyboardSoundsEl = document.getElementById('keyboardSoundsToggle');
  if (keyboardSoundsEl) keyboardSoundsEl.addEventListener('change', saveSoundAndFeedbackSettings);

  // Appearance
  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) themeSelect.addEventListener('change', saveAppearanceSettings);
  const fontSelect = document.getElementById('font-size-select');
  if (fontSelect) fontSelect.addEventListener('change', saveAppearanceSettings);

  // Notification & Privacy
  const emailNotifEl = document.getElementById('emailNotificationsToggle');
  if (emailNotifEl) emailNotifEl.addEventListener('change', saveNotificationAndPrivacySettings);
  const pushNotifEl = document.getElementById('pushNotificationsToggle');
  if (pushNotifEl) pushNotifEl.addEventListener('change', saveNotificationAndPrivacySettings);
  const profileVisEl = document.getElementById('profileVisibleToggle');
  if (profileVisEl) profileVisEl.addEventListener('change', saveNotificationAndPrivacySettings);
  const activityEl = document.getElementById('activityStatusToggle');
  if (activityEl) activityEl.addEventListener('change', saveNotificationAndPrivacySettings);
});
