export function renderHeader(activePage) {
  const isActive = (page) =>
    activePage === page
      ? 'text-[#D96B27] font-bold'
      : 'text-[#F3E6D0] hover:text-[#D96B27]';

  return `
    <header
      class="sticky top-0 backdrop-blur-md bg-[#24150B] flex items-center justify-between px-10 h-[60px] z-50"
    >
      <a href="/" class="flex items-center gap-1 select-none">
        <span
          class="text-2xl tracking-wide"
          style="font-family: 'Fraunces', serif;"
        >
          DRIF<span class="text-[#D96B27]">TYPE</span>
        </span>
      </a>

      <nav class="flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
        <a
          href="/practice"
          id="practice-btn"
          class="transition-colors ${isActive('practice')}"
        >Play</a>
        <a
          href="/statistics"
          id="stat-btn"
          class="transition-colors ${isActive('stats')}"
        >Statistics</a>
        <a
          href="/settings"
          id="setting-btn"
          class="transition-colors ${isActive('settings')}"
        >Profile</a>
      </nav>

      <div class="relative flex items-center" id="user-menu-container">
        <button
          id="user-menu-button"
          class="flex items-center gap-3 cursor-pointer group"
        >
          <div
            id="avatar-img"
            class="w-8 h-8 rounded-full bg-[#D96B27] flex items-center justify-center text-white text-sm font-bold"
          >
          </div>
          <span class="text-sm text-[#F3E6D0]" id="username">
            <span class="flex justify-center items-center">
              <span
                class="w-5 h-5 border-2 border-[rgba(243,230,208,0.08)] border-t-[#D96B27] rounded-full animate-spin"
              ></span>
            </span>
          </span>
          <i
            class="fa-solid fa-angle-down text-xs text-[#B9A895] group-hover:translate-y-0.5 transition-transform"
          ></i>
        </button>
        <div
          id="dropdown"
          class="absolute right-0 top-full mt-2 w-40 bg-[#2C1A0E] rounded-lg shadow-lg hidden z-50 border border-[rgba(243,230,208,0.08)] overflow-hidden"
        >
          <a
            href="/profile"
            class="flex justify-between items-center px-3 py-2 text-sm text-[#F3E6D0] hover:bg-[#D96B27] hover:text-white transition-colors"
          >
            Profile
            <i class="fas fa-user text-xs"></i>
          </a>
          <button
            class="w-full text-left flex justify-between items-center px-3 py-2 text-sm text-[#F3E6D0] hover:bg-[#D96B27] hover:text-white transition-colors"
            id="logout-btn"
          >
            Sign out
            <i class="fas fa-right-from-bracket text-xs"></i>
          </button>
        </div>
      </div>
    </header>
  `;
}

export function initHeaderMenu() {
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
}
