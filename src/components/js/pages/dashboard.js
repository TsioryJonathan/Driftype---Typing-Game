document.addEventListener('DOMContentLoaded', () => {
  userAvatarOption();
  initializeDropdowns();
});

const userAvatarOption = () => {
  const button = document.getElementById('user-menu-button');
  const dropdown = document.getElementById('dropdown');
  const container = document.getElementById('user-menu-container');
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
};


const initializeDropdowns = () => {
  const dropdowns = [
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

  dropdowns.forEach(({ containerId, buttonId, dropdownId, selectId, textId }) => {
    const container = document.getElementById(containerId);
    const button = document.getElementById(buttonId);
    const dropdown = document.getElementById(dropdownId);
    const select = document.getElementById(selectId);
    const text = document.getElementById(textId);

    // Set initial text
    const initialOption = select.options[select.selectedIndex];
    text.textContent = initialOption.text;

    // Toggle dropdown
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
      
      dropdowns.forEach(dataSelect => {
        if (dataSelect.dropdownId !== dropdownId) {
          document.getElementById(dataSelect.dropdownId).classList.add('hidden');
        }
      });
    });

    // Handle option selection
    const options = dropdown.querySelectorAll('button');
    options.forEach(option => {
      option.addEventListener('click', () => {
        const value = option.getAttribute('data-value');
        const optionText = option.textContent;
        
        select.value = value;
        text.textContent = optionText;
        
        dropdown.classList.add('hidden');
        
        // Trigger change event on select
        const event = new Event('change');
        select.dispatchEvent(event);
      });
    });
  });

  document.addEventListener('click', (e) => {
    dropdowns.forEach(({ containerId, dropdownId }) => {
      const container = document.getElementById(containerId);
      const dropdown = document.getElementById(dropdownId);
      if (!container.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  });
};

