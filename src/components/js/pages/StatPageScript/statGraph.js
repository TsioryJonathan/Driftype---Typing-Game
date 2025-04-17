// Exemple de données, tu peux récupérer ces informations depuis ton serveur ou une API
const statistiques = {
  labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
  wpm: [58, 72, 65, 80, 92], // Exemple de mots par minute
  accuracy: [98.5, 97.2, 99.1, 96.8, 99.5], // Exactitude en pourcentage
  times: [150, 120, 135, 100, 110], // Temps en secondes
};

// Initialisation du graphique
const chartDom = document.getElementById('chart');
const myChart = echarts.init(chartDom);

const option = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['WPM', 'Accuracy'],
  },
  xAxis: {
    type: 'category',
    data: statistiques.labels,
  },
  yAxis: {
    type: 'value',
    name: 'WPM / Exactitude (%)',
    axisLine: {
      lineStyle: {
        color: '#1f77b4', 
      },
    },
  },
  series: [
    {
      name: 'WPM',
      type: 'line',
      data: statistiques.wpm,
      lineStyle: {
        color: '#1f77b4', 
      },
      symbol: 'circle',
      smooth: true,
    },
    {
      name: 'Exactitude',
      type: 'line',
      data: statistiques.accuracy,
      lineStyle: {
        color: '#ff7f0e', // Couleur pour la ligne Exactitude
      },
      symbol: 'circle', // Utilisation de cercles pour les points de la ligne
      smooth: true, // Lignes lissées
    },
  ],
};

myChart.setOption(option);

window.addEventListener('resize', function () {
  myChart.resize();
});
