window.toggleSection = function (id) {
  const section = document.getElementById(id);
  const chevron = document.getElementById(`chevron-${id}`);
  const isCollapsed = section.classList.contains('max-h-0');

  if (isCollapsed) {
    section.classList.remove('max-h-0', 'py-0');
    section.classList.add('py-4', 'max-h-[1000px]');
    chevron.classList.add('rotate-180');
  } else {
    section.classList.remove('max-h-[1000px]', 'py-4');
    section.classList.add('max-h-0', 'py-0');
    chevron.classList.remove('rotate-180');
  }
};
