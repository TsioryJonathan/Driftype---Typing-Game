const toggleTheme = () => {
  const HTML = document.documentElement;
  const themeSelect = document.getElementById('theme-select');

  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const applyTheme = (theme) => {

    HTML.style.colorScheme = theme;
    if (theme === 'auto') {
      HTML.removeAttribute('data-theme');
      HTML.style.colorScheme = getSystemTheme();
    } else {
      HTML.setAttribute('data-theme', theme);
      HTML.style.colorScheme = theme;
    }
    localStorage.setItem('theme', theme);
    if (themeSelect) {
      themeSelect.value = theme;
    }
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    applyTheme(savedTheme);

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (localStorage.getItem('theme') === 'auto') {
          applyTheme('auto');
        }
      });
  };

  if (themeSelect) {
    themeSelect.addEventListener('change', () => {
      applyTheme(themeSelect.value);
    });
  }

  initTheme();
};

toggleTheme();
