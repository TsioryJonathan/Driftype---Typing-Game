export function renderHeader(activePage) {
  const isActive = (page) => (activePage === page ? 'bg-[var(--color-bg)]' : '');

  return `
    <header
      class="sticky top-0 backdrop-blur-md bg-[var(--color-bg-secondary)] flex items-center justify-between px-10 h-[60px] z-50"
    >
      <div class="h-full flex items-center">
        <a href="/">
          <img
            src="/src/assets/noBg.png"
            alt="Drifttype"
            class="h-full w-40 object-cover"
          >
        </a>
      </div>

      <nav class="w-full max-w-md mx-auto h-[40px]">
        <div
          class="flex justify-between items-center bg-[var(--color-input)] rounded-full h-full"
        >
          <div class="relative group w-full h-full">
            <button
              data-tooltip-target="tooltip-practice"
              type="button"
              class="flex flex-col items-center justify-center rounded-s-full hover:bg-[var(--color-bg)] transition w-full h-full cursor-pointer ${isActive('practice')}"
              id="practice-btn"
            >
              <i
                class="fa-solid fa-keyboard text-[var(--color-text)] text-2xl group-hover:text-amber-500"
              ></i>
              <span class="sr-only">Practice</span>
            </button>
            <div
              id="tooltip-practice"
              class="absolute bottom-full mb-2 left-1/2 px-3 py-2 text-sm font-medium text-[var(--color-text)] bg-[var(--color-bg-secondary)] rounded-lg shadow opacity-0 group-hover:opacity-100 transition"
            >
              Practice
            </div>
          </div>

          <div class="relative group w-full h-full">
            <button
              data-tooltip-target="tooltip-statistics"
              type="button"
              class="flex flex-col items-center justify-center hover:bg-[var(--color-bg)] transition w-full h-full cursor-pointer ${isActive('stats')}"
              id="stat-btn"
            >
              <i
                class="fa-solid fa-chart-column text-[var(--color-text)] text-2xl group-hover:text-amber-500"
              ></i>
              <span class="sr-only">Statistics</span>
            </button>
            <div
              id="tooltip-statistics"
              class="absolute bottom-full mb-2 left-1/2 px-3 py-2 text-sm font-medium text-[var(--color-text)] bg-[var(--color-bg-secondary)] rounded-lg shadow opacity-0 group-hover:opacity-100 transition"
            >
              Statistics
            </div>
          </div>

          <div class="relative group w-full h-full">
            <button
              data-tooltip-target="tooltip-settings"
              type="button"
              class="cursor-pointer flex flex-col items-center justify-center rounded-e-full hover:bg-[var(--color-bg)] transition w-full h-full ${isActive('settings')}"
              id="setting-btn"
            >
              <i
                class="fa-solid fa-gear text-[var(--color-text)] text-2xl group-hover:text-amber-500"
              ></i>
              <span class="sr-only">Settings</span>
            </button>
            <div
              id="tooltip-settings"
              class="absolute bottom-full mb-2 left-1/2 px-3 py-2 text-sm font-medium text-[var(--color-text)] bg-[var(--color-bg-secondary)] rounded-lg shadow opacity-0 group-hover:opacity-100 transition"
            >
              Settings
            </div>
          </div>
        </div>
      </nav>

      <div class="relative h-full flex items-center" id="user-menu-container">
        <button
          id="user-menu-button"
          class="flex items-center gap-5 pl-2 pr-10 py-1 bg-[var(--color-input)] rounded-full transition cursor-pointer -translate-y-0.5 group min-w-40 w-fit relative"
        >
          <img
            id="avatar-img"
            src="https://i.pravatar.cc/40"
            alt="Avatar"
            class="w-8 h-8 rounded-full"
          >
          <span class="text-sm" id="username">
            <span class="flex justify-center items-center">
              <span
                class="w-6 h-6 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin"
              ></span>
            </span>
          </span>
          <i
            class="fa-solid fa-angle-down text-xs absolute right-5 group-hover:translate-y-0.5"
          ></i>
        </button>
        <div
          id="dropdown"
          class="absolute right-0 -bottom-16 w-36 bg-[var(--color-bg)] text-midnight-800 rounded-lg shadow-g hidden z-50 border border-[var(--color-input)] overflow-hidden"
        >
          <a
            href="/profile"
            class="flex justify-between items-center px-2 py-1 hover:bg-[var(--color-primary)] hover:text-[var(--color-text)] text-[var(--color-text)]"
          >
            Profile
            <i class="fas fa-user"></i>
          </a>
          <button
            class="w-full text-left flex justify-between items-center px-2 py-1 hover:bg-[var(--color-primary)] hover:text-[var(--color-text)] text-[var(--color-text)]"
            id="logout-btn"
          >
            Sign out
            <i class="fas fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </header>
  `;
}
