/**
 * This is the html for the button :
 *  <div class="theme-switcher">
 *    <button data-theme="light" class="theme-btn" aria-label="Light mode">Dark</button>
 *    <button data-theme="dark" class="theme-btn" aria-label="Dark mode">Light</button>
 *    <button data-theme="auto" class="theme-btn" aria-label="Auto mode">Auto</button>
 *  </div>
 * 
 */


const toggleTheme = () => {
  const HTML = document.documentElement;
  const applyTheme = (theme) => {
    if (theme === 'auto') {
      HTML.removeAttribute('color-scheme');
      const systemTheme = getSystemTheme();
      HTML.style.colorScheme = systemTheme;
    } else {
      HTML.setAttribute('color-scheme', theme);
      HTML.style.colorScheme = theme;
    }
    localStorage.setItem('theme', theme);
  }
  
  const updateActiveButton = (theme) => {
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });
  }
  
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    applyTheme(savedTheme);
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('theme') === 'auto') {
        applyTheme('auto');
      }
    });
  }
  
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      applyTheme(theme);
    });
  });
  
  document.addEventListener('DOMContentLoaded', initTheme);
}

toggleTheme();
