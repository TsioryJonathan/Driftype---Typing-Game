
const returnTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';


const colors = {
  dark: {
    background: 0x0f0c29, 
    line: 0x8b2be2, 
  },
  light: {
    background: 0xffffff, 
    line: 0x1e40af, 
  },
};


const theme = returnTheme();


VANTA.NET({
  el: '#vanta-bg',
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.0,
  minWidth: 200.0,
  scale: 1.0,
  scaleMobile: 1.0,
  color: colors[theme].line,
  backgroundColor: colors[theme].background, 
  points: 5,
  maxDistance: 20,
  spacing: 17.0,
  alpha: 0.5,
  backgroundAlpha: 1,
});


window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    const newTheme = e.matches ? 'dark' : 'light';

   
    VANTA.NET({
      el: '#vanta-bg',
      color: colors[newTheme].line,
      backgroundColor: colors[newTheme].background,
    });
  });
