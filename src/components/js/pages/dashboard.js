import { displayUserBadges } from '../pages/badges-display.js';
import { badgeManager } from '../badges.js';

// Configuration centralisée
const DROPDOWNS_CONFIG = [
  {
    containerId: 'mode-container',
    buttonId: 'mode-button',
    dropdownId: 'mode-dropdown',
    selectId: 'mode',
    textId: 'mode-text'
  },
  {
    containerId: 'language-container',
    buttonId: 'language-button',
    dropdownId: 'language-dropdown',
    selectId: 'language',
    textId: 'language-text'
  },
  {
    containerId: 'timer-container',
    buttonId: 'timer-button',
    dropdownId: 'timer-dropdown',
    selectId: 'timer',
    textId: 'timer-text'
  }
];

// Initialisation principale
const initDashboard = () => {
  try {
    const userData = localStorage.getItem('typing_game_user');
    if (!userData) {
      console.debug('Redirection vers la page de connexion...');
      window.location.href = '/src/components/pages/login.html';
      return;
    }

    const { id: userId } = JSON.parse(userData);
    if (!userId) {
      console.error('ID utilisateur invalide');
      localStorage.removeItem('typing_game_user');
      window.location.href = '/src/components/pages/login.html';
      return;
    }

    console.debug('Chargement du dashboard pour:', userId);
    
    // Initialize badges if they don't exist
    const userBadges = badgeManager.getUserBadges(userId);
    if (!userBadges?.badges) {
      badgeManager.saveBadges(userId, []);
    }

    // Initialize UI components
    displayUserBadges(userId);
    initUserMenu();
    initDropdowns();
    
  } catch (error) {
    console.error('Erreur initialisation dashboard:', error);
    localStorage.removeItem('typing_game_user');
    window.location.href = '/src/components/pages/login.html';
  }
};

// Gestion du menu utilisateur
const initUserMenu = () => {
  const menuContainer = document.getElementById('user-menu-container');
  if (!menuContainer) return;

  const button = menuContainer.querySelector('#user-menu-button');
  const dropdown = menuContainer.querySelector('#dropdown');

  button?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown?.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!menuContainer.contains(e.target)) {
      dropdown?.classList.add('hidden');
    }
  });
};

// Gestion des dropdowns
const initDropdowns = () => {
  DROPDOWNS_CONFIG.forEach(config => {
    const { containerId, buttonId, dropdownId, selectId, textId } = config;
    
    const container = document.getElementById(containerId);
    const button = document.getElementById(buttonId);
    const dropdown = document.getElementById(dropdownId);
    const select = document.getElementById(selectId);
    const text = document.getElementById(textId);

    if (!container || !button || !dropdown || !select || !text) {
      console.warn(`Élément manquant pour ${containerId}`);
      return;
    }

    // Initialisation
    text.textContent = select.selectedOptions[0].textContent;

    // Événements
    button.addEventListener('click', handleDropdownToggle(config));
    initDropdownOptions(dropdown, select, text);
  });

  // Fermeture au clic externe
  document.addEventListener('click', (e) => {
    DROPDOWNS_CONFIG.forEach(({ containerId, dropdownId }) => {
      const container = document.getElementById(containerId);
      const dropdown = document.getElementById(dropdownId);
      if (container && dropdown && !container.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  });
};

// Helpers
const handleDropdownToggle = (config) => (e) => {
  e.stopPropagation();
  const dropdown = document.getElementById(config.dropdownId);
  dropdown?.classList.toggle('hidden');
  
  // Fermer les autres dropdowns
  DROPDOWNS_CONFIG.forEach(({ dropdownId }) => {
    if (dropdownId !== config.dropdownId) {
      document.getElementById(dropdownId)?.classList.add('hidden');
    }
  });
};

const initDropdownOptions = (dropdown, select, textElement) => {
  dropdown.querySelectorAll('button').forEach(option => {
    option.addEventListener('click', () => {
      select.value = option.dataset.value;
      textElement.textContent = option.textContent;
      dropdown.classList.add('hidden');
      select.dispatchEvent(new Event('change'));
    });
  });
};

// Lancement
document.addEventListener('DOMContentLoaded', initDashboard);