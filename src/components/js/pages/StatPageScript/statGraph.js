import { API_URL } from "../../../../utils/url.js";
import { getUser, getToken } from "../../../../utils/auth.js";

function showLoginWarningToast() {
  const toast = document.getElementById("login-warning-toast");
  toast.classList.replace("hidden", "flex");
  toast.classList.add("opacity-100");

  setTimeout(() => {
    toast.classList.add("opacity-0");
    setTimeout(() => toast.classList.replace("flex", "hidden"), 300);
  }, 4000); 
}

const getStat = async () => {
  if (!getUser()) {
    showLoginWarningToast();
    return { wpm: [0], accuracy: [0] };
  }
  const { id } = getUser();
  const token = getToken();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_URL}/stats/recent/${id}`, {
      signal: controller.signal,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    clearTimeout(timeoutId);

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
    console.log("Error fetching stats:", error);
    return { wpm: [0], accuracy: [0] };
  }
};

const { wpm, accuracy } = await getStat();
const labels = "1 2 3 4 5 6 7 8 9 10".split(" ");

// Initialisation du graphique
const chartDom = document.getElementById("chart");
const myChart = echarts.init(chartDom);

const option = {
  backgroundColor: "transparent",
  tooltip: {
    trigger: "axis",
    backgroundColor: "#24150B",
    borderColor: "rgba(243,230,208,0.08)",
    textStyle: {
      color: "#F3E6D0",
      fontFamily: "Space Grotesk",
      fontSize: 12,
    },
  },
  legend: {
    data: ["WPM", "Accuracy"],
    textStyle: {
      color: "#B9A895",
      fontFamily: "Space Grotesk",
      fontSize: 11,
    },
    top: 0,
    right: 0,
  },
  grid: {
    top: 40,
    right: 16,
    bottom: 24,
    left: 48,
  },
  xAxis: {
    type: "category",
    data: labels,
    axisLine: {
      lineStyle: {
        color: "rgba(243,230,208,0.08)",
      },
    },
    axisTick: { show: false },
    axisLabel: {
      color: "#806F5D",
      fontFamily: "Space Grotesk",
      fontSize: 11,
    },
  },
  yAxis: {
    type: "value",
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: {
      lineStyle: {
        color: "rgba(243,230,208,0.06)",
      },
    },
    axisLabel: {
      color: "#806F5D",
      fontFamily: "Space Grotesk",
      fontSize: 11,
    },
  },
  series: [
    {
      name: "WPM",
      type: "line",
      data: wpm,
      lineStyle: {
        color: "#D96B27",
        width: 2,
      },
      itemStyle: {
        color: "#D96B27",
      },
      symbol: "circle",
      symbolSize: 6,
      smooth: true,
      areaStyle: {
        color: {
          type: "linear",
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(217,107,39,0.15)" },
            { offset: 1, color: "rgba(217,107,39,0)" },
          ],
        },
      },
    },
    {
      name: "Accuracy",
      type: "line",
      data: accuracy,
      lineStyle: {
        color: "#F28A3D",
        width: 1.5,
        type: "dashed",
      },
      itemStyle: {
        color: "#F28A3D",
      },
      symbol: "circle",
      symbolSize: 4,
      smooth: true,
    },
  ],
};

myChart.setOption(option);

window.addEventListener("resize", function () {
  myChart.resize();
});
