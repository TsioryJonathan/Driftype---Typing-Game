import { API_URL } from "../../../../utils/url.js";

const displayDefaultState = (tbody) => {
  const tableRow = document.createElement("tr");
  tableRow.classList.add(
    "transition-colors",
    "duration-150",
    "hover:bg-[var(--color-bg-secondary)]"
  );
  tableRow.innerHTML = `
    <td colspan="5" class="px-6 py-4 text-center text-[var(--color-text)]">
      No data available
    </td>
  `;
  tbody.innerHTML = "";
  tbody.appendChild(tableRow);
};

const fetchRecentStat = async () => {
  const userData = localStorage.getItem("typing_game_user");
  const tbody = document.getElementById("tbody");

  // Si aucun utilisateur n'est trouvé, on arrête l'exécution de la fonction
  if (!userData) {
    console.log("No data");
    displayDefaultState(tbody);
    return;
  }
  const token = localStorage.getItem("typing_game_token");

  const { id } = JSON.parse(userData);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${API_URL}/stats/recent/${id}`, {
      signal: controller.signal,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    clearTimeout(timeoutId);

    const data = await res.json();

    if (!data || data.length === 0) {
      displayDefaultState(tbody);
      return;
    }

    tbody.innerHTML = "";

    data.forEach((stat) => {
      const tableRow = document.createElement("tr");
      let language;
      let icon;
      if (stat.language === "en") {
        language = "English";
        icon = '<span class="flag-icon flag-icon-gb"></span>';
      }
      if (stat.language === "fr") {
        language = "French";
        icon = '<span class="flag-icon flag-icon-fr"></span>';
      }
      if (stat.language === "es") {
        language = "Espanol";
        icon = '<span class="flag-icon flag-icon-es"></span>';
      }
      if (stat.language === "de") {
        language = "Deutch";
        icon = '<span class="flag-icon flag-icon-de"></span>';
      }
      if (stat.language === "it") {
        language = "Italiano";
        icon = '<span class="flag-icon flag-icon-it"></span>';
      }
      if (stat.language === "pt") {
        language = "Portugues";
        icon = '<span class="flag-icon flag-icon-pt"></span>';
      }

      const date = new Date(stat.created_at).toLocaleString("en-GB", {
        timeZone: "Africa/Nairobi",
      });
      tableRow.classList.add(
        "transition-colors",
        "duration-150",
        "hover:bg-[var(--color-bg-secondary)]"
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
          ${stat.difficulty}
          </td>
          <td class="px-6 py-4 text-[var(--color-text)]">
          ${language}   ${icon}
          </td>
        `;

      tbody.appendChild(tableRow);
    });
  } catch (err) {
    console.warn("Error fetching recent stats:", err);
    displayDefaultState(tbody);
  }
};

fetchRecentStat();
