// Fonction pour détecter le thème du système
const returnTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

// Couleurs pour chaque thème
const colors = {
  dark: {
    background: 0x0f0c29, // Couleur de fond sombre (bleu nuit)
    line: 0x8b2be2, // Couleur des lignes (violet)
  },
  light: {
    background: 0xffffff, // Couleur de fond clair (blanc)
    line: 0x1e40af, // Couleur des lignes (bleu clair)
  },
};

// Récupérer le thème du système
const theme = returnTheme();

// Configurer VANTA avec les couleurs dynamiques
VANTA.NET({
  el: '#vanta-bg',
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.0,
  minWidth: 200.0,
  scale: 1.0,
  scaleMobile: 1.0,
  color: colors[theme].line, // Utilisation de la couleur des lignes selon le thème
  backgroundColor: colors[theme].background, // Utilisation de la couleur de fond selon le thème
  points: 5,
  maxDistance: 20,
  spacing: 17.0,
  alpha: 0.5,
  backgroundAlpha: 1,
});

// Écouter les changements de thème et mettre à jour la couleur dynamique
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    const newTheme = e.matches ? 'dark' : 'light';

    // Mettre à jour les couleurs avec le nouveau thème
    VANTA.NET({
      el: '#vanta-bg',
      color: colors[newTheme].line,
      backgroundColor: colors[newTheme].background,
    });
  });
