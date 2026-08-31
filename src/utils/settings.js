export const loadSettings = (key, defaults = {}) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
};

export const saveSettings = (key, settings) => {
  localStorage.setItem(key, JSON.stringify(settings));
};

export const initSettingsToggle = (elementId, storageKey, property, callback) => {
  const el = document.getElementById(elementId);
  if (!el) return;
  const settings = loadSettings(storageKey);
  if (property in settings) el.checked = settings[property];
  el.addEventListener('change', () => {
    const current = loadSettings(storageKey);
    current[property] = el.checked;
    saveSettings(storageKey, current);
    if (callback) callback(current);
  });
};
