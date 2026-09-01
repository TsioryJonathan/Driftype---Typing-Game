export const logoStyle = () => {
  const logo = document.getElementById('logo');
  logo.innerHTML = `<img src="../../assets/noBg.png" alt="Driftype Logo" class="w-26 mx-auto">`;
};

export const inputStyle = () => {
  const inputs = document.querySelectorAll('.input-form');

  inputs.forEach((input) => {
    input.classList.add(
      'p-2',
      'block',
      'h-10',
      'w-full',
      'bg-[#2C1A0E]',
      'border',
      'border-[rgba(243,230,208,0.12)]',
      'shadow-sm',
      'focus:ring-[#D96B27]',
    );
  });
  iconFormStyle();
};

export const iconFormStyle = () => {
  const icons = document.querySelectorAll('.icon-form');

  icons.forEach((icon) => {
    icon.classList.add(
      'p-2',
      'bg-[#D96B27]',
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
