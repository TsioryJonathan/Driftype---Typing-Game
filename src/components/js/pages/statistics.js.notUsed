// Fonction pour charger les statistiques
async function loadStatistics() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const response = await fetch('http://localhost:3000/api/statistics', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }

    const data = await response.json();
    updateStatisticsDisplay(data);
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
}

// Fonction pour mettre à jour l'affichage des statistiques
function updateStatisticsDisplay(data) {
  const { recentStats, progression } = data;

  // Mettre à jour les statistiques récentes
  document.getElementById('avgWpm').textContent = recentStats.avg_wpm || '0';
  document.getElementById('avgAccuracy').textContent = recentStats.avg_accuracy ? `${recentStats.avg_accuracy}%` : '0%';
  document.getElementById('bestWpm').textContent = recentStats.best_wpm || '0';
  document.getElementById('gamesPlayed').textContent = recentStats.games_played || '0';

  // Créer le graphique WPM
  createChart('wpmChart', 'Progression WPM', progression.map(p => p.wpm), progression.map(p => new Date(p.created_at).toLocaleDateString()));

  // Créer le graphique de précision
  createChart('accuracyChart', 'Progression de la Précision', progression.map(p => p.accuracy), progression.map(p => new Date(p.created_at).toLocaleDateString()));
}

// Fonction pour créer un graphique
function createChart(canvasId, label, data, labels) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Détruire le graphique existant s'il y en a un
  if (window[canvasId]) {
    window[canvasId].destroy();
  }

  window[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Charger les statistiques au chargement de la page
document.addEventListener('DOMContentLoaded', loadStatistics);

// Rafraîchir les statistiques toutes les 5 minutes
setInterval(loadStatistics, 300000);
