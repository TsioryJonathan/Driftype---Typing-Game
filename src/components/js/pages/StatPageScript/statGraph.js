import { API_URL } from '../login.js';

const getStat = async () => {
  if (!localStorage.getItem('typing_game_user')) {
    throw new Error('User not logged in');
  }
  const { id } = JSON.parse(localStorage.getItem('typing_game_user'));

  try {
    const response = await fetch(`${API_URL}/stats/recent/${id}`);
    const data = await response.json();
    const wpm = [];
    const accuracy = [];
    for (const stat of data) {
      wpm.push(stat.wpm);
      accuracy.push(parseInt(stat.accuracy));
    }
    return {
      wpm: wpm.reverse(),
      accuracy: accuracy.reverse(),
    };
  } catch (error) {
    throw new Error(error);
  }
};

const { wpm, accuracy } = await getStat();
const labels = '1 2 3 4 5 6 7 8 9 10'.split(' ');

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
    data: labels,
  },
  yAxis: {
    type: 'value',
    name: 'WPM / Accuracy (%)',
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
      data: wpm,
      lineStyle: {
        color: '#1f77b4',
      },
      symbol: 'circle',
      smooth: true,
    },
    {
      name: 'Accuracy',
      type: 'line',
      data: accuracy,
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
