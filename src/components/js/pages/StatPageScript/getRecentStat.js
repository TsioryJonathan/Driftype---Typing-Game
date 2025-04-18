import { API_URL } from '../login.js';

const displayDefaultState = (tbody) => {
  const tableRow = document.createElement('tr');
  tableRow.classList.add(
    'transition-colors',
    'duration-150',
    'hover:bg-[var(--color-bg-secondary)]',
  );
  tableRow.innerHTML = `
    <td colspan="5" class="px-6 py-4 text-center text-[var(--color-text)]">
      No data available
    </td>
  `;
  tbody.innerHTML = '';
  tbody.appendChild(tableRow);
};

const fetchRecentStat = async () => {
  const userData = localStorage.getItem('typing_game_user');
  const tbody = document.getElementById('tbody');

  // Si aucun utilisateur n'est trouvé, on arrête l'exécution de la fonction
  if (!userData) {
    console.log('No data');
    displayDefaultState(tbody);
    return;
  }

  const { id } = JSON.parse(userData);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${API_URL}/stats/recent/${id}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await res.json();

    if (!data || data.length === 0) {
      displayDefaultState(tbody);
      return;
    }

    tbody.innerHTML = '';

    data.forEach((stat) => {
      const tableRow = document.createElement('tr');
      let language;
      if (stat.language === 'en') language = 'English';
      if (stat.language === 'fr') language = 'French';
      if (stat.language === 'es') language = 'Espanol';
      if (stat.language === 'de') language = 'Deutch';
      if (stat.language === 'it') language = 'Italiano';
      if (stat.language === 'pt') language = 'Protugues';

      const date = new Date(stat.created_at).toLocaleString('en-GB', {
        timeZone: 'Africa/Nairobi',
      });
      tableRow.classList.add(
        'transition-colors',
        'duration-150',
        'hover:bg-[var(--color-bg-secondary)]',
      );

      tableRow.innerHTML = `
          <td class="px-6 py-4 text-[var(--color-text)]">
            ${date}
          </td>
          <td class="px-6 py-4 font-medium text-[var(--color-text)]">
            ${stat.wpm} wpm
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center justify-center gap-2">
              <div class="h-2 w-20 rounded-full bg-[var(--color-bg)]">
                <div
                  class="h-2 rounded-full bg-[var(--color-success)]"
                  style="width: ${Number(stat.accuracy)}%"
                ></div>
              </div>
              <span class="text-[var(--color-text)]">
                ${stat.accuracy}%
              </span>
            </div>
          </td>
          <td class="px-6 py-4 text-[var(--color-text)]">
            ${stat.time_taken} sec
          </td>
          <td class="px-6 py-4 text-[var(--color-text)]">
          ${language} , ${stat.difficulty}
          </td>
        `;

      tbody.appendChild(tableRow);
    });
  } catch (err) {
    console.warn('Error fetching recent stats:', err);
    displayDefaultState(tbody);
  }
};

fetchRecentStat();
