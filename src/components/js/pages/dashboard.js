document.addEventListener('DOMContentLoaded', () => {
  userAvatarOption();

  initializeDropdowns();
  navBar();

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

const navBar = () => {
  const nav = document.getElementById("navbar");

  nav.innerHTML = `
    <div class="grid h-full max-w-sm grid-cols-3 mx-auto">
          <button
            data-tooltip-target="tooltip-practice"
            type="button"
            class="inline-flex flex-col items-center justify-center px-5 rounded-s-full bg-[var(--color-input)] hover:bg-[var(--color-bg)] cursor-pointer group"
          >
            <i
              class="fa-solid fa-keyboard text-[var(--color-text)] text-2xl group-hover:text-amber-500"
            ></i>
            <span class="sr-only">Practice</span>
          </button>
          <div
            id="tooltip-practice"
            role="tooltip"
            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-[var(--color-text)] transition-opacity duration-300 bg-[var(--color-bg)] rounded-lg shadow-xs opacity-0 tooltip"
          >
            Practice
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
          <button
            data-tooltip-target="tooltip-statistics"
            type="button"
            class="inline-flex flex-col items-center justify-center px-5 bg-[var(--color-input)] hover:bg-[var(--color-bg)] cursor-pointer group"
          >
            <i
              class="fa-solid fa-chart-column text-[var(--color-text)] text-2xl group-hover:text-amber-500"
            ></i>
            <span class="sr-only">Statistics</span>
          </button>
          <div
            id="tooltip-statistics"
            role="tooltip"
            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-[var(--color-text)] transition-opacity duration-300 bg-[var(--color-bg)] rounded-lg shadow-xs opacity-0 tooltip"
          >
            Statistics
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
          <button
            data-tooltip-target="tooltip-settings"
            type="button"
            class="inline-flex flex-col items-center justify-center px-5 rounded-e-full bg-[var(--color-input)] hover:bg-[var(--color-bg)] cursor-pointer group"
          >
            <i
              class="fa-solid fa-gear text-[var(--color-text)] text-2xl group-hover:text-amber-500"
            ></i>
            <span class="sr-only">Settings</span>
          </button>
          <div
            id="tooltip-settings"
            role="tooltip"
            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-[var(--color-text)] transition-opacity duration-300 bg-[var(--color-bg)] rounded-lg shadow-xs opacity-0 tooltip"
          >
            Settings
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>`;
};

