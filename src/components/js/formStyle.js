export const logoStyle = () => {
  const logo = document.getElementById('logo');
  const logoSrc = {
    light: '../../assets/noBg.png',
    dark: '../../assets/noBg.png',
    auto: '../../assets/noBg.png',
  };
  const theme = localStorage.getItem('theme') || 'light';
  logo.innerHTML = `<img src="${logoSrc[theme]}" alt="TajoType Logo" class="w-26 mx-auto">`;
};

export const inputStyle = () => {
  const inputs = document.querySelectorAll('.input-form');

  inputs.forEach((input) => {
    input.classList.add(
      'p-2',
      'block',
      'h-10',
      'w-full',
      'bg-[var(--color-primary)]',
      'border-primary',
      'shadow-sm',
      'focus:ring-active-500',
    );
  });
  iconFormStyle();
};

export const iconFormStyle = () => {
  const icons = document.querySelectorAll('.icon-form');

  icons.forEach((icon) => {
    icon.classList.add(
      'p-2',
      'bg-active-500/90',
      'text-white',
      'rounded-tl-md',
      'rounded-br-md',
      'inline-block',
      'mr-0.5',
    );
  });
};

export const showPassword = () => {
  const checkShow = document.getElementById('show-password');
  const password = document.getElementById('password');

  checkShow.addEventListener('change', () => {
    const type = checkShow.checked ? 'text' : 'password';
    password.setAttribute('type', type);
  });
};
