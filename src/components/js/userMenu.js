const menuContainer = document.getElementById('user-menu-container');
if (menuContainer) {
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
