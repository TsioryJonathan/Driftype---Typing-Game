import { API_URL } from "../../../../utils/url.js";
import { getUser, getToken } from "../../../../utils/auth.js";

const displayDefaultState = (tbody) => {
  const tableRow = document.createElement("tr");
  tableRow.innerHTML = `
    <td colspan="6" style="text-align:center;padding:16px;color:var(--cream-muted);">
      No data available
    </td>
  `;
  tbody.innerHTML = "";
  tbody.appendChild(tableRow);
};

const fetchRecentStat = async () => {
  const userData = getUser();
  const tbody = document.getElementById("tbody");

  
  if (!userData) {
    console.log("No data");
    displayDefaultState(tbody);
    return;
  }
  const token = getToken();

  const { id } = userData;

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

    tableRow.innerHTML = `
          <td>${date}</td>
          <td style="font-weight:500;">${stat.wpm} wpm</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="height:4px;width:80px;border-radius:2px;background:rgba(243,230,208,0.06);overflow:hidden;">
                <div style="height:100%;border-radius:2px;background:#D96B27;width:${Number(stat.accuracy)}%;"></div>
              </div>
              <span>${stat.accuracy}%</span>
            </div>
          </td>
          <td>${stat.time_taken} sec</td>
          <td>${stat.difficulty}</td>
          <td>${language} ${icon}</td>
        `;

      tbody.appendChild(tableRow);
    });
  } catch (err) {
    console.warn("Error fetching recent stats:", err);
    displayDefaultState(tbody);
  }
};

fetchRecentStat();
