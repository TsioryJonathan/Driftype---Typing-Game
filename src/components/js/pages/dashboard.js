document.addEventListener('DOMContentLoaded', () => {
  userAvatarOption();
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
