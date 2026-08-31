import { updateProgressBar } from "../progressBar.js";

let resultsChart = null;
let timelineChart = null;

let timelineWpm = [];
let timelineErrors = [];
let timelineLabels = [];
let timelineInterval = null;

let engineFns = null;

export const initChart = (fns) => {
  engineFns = fns;
};

export const resetChart = () => {
  if (resultsChart) {
    resultsChart.destroy();
    resultsChart = null;
  }
};

export const startTimelineTracking = () => {
  timelineWpm = [];
  timelineErrors = [];
  timelineLabels = [];
  if (timelineInterval) clearInterval(timelineInterval);
  let seconds = 0;
  timelineInterval = setInterval(() => {
    if (!engineFns) return;
    const { wpm } = engineFns.getCurrentStats();
    timelineWpm.push(Number(wpm));
    timelineErrors.push(engineFns.getTotalKeystrokes() - engineFns.getCorrectLetters());
    timelineLabels.push(seconds + "s");
    seconds++;
  }, 1000);
};

export const stopTimelineTracking = () => {
  if (timelineInterval) clearInterval(timelineInterval);
  timelineInterval = null;
};

export const calcConsistency = () => {
  if (!timelineWpm || timelineWpm.length < 2) return "-";
  const mean = timelineWpm.reduce((a, b) => a + b, 0) / timelineWpm.length;
  const variance =
    timelineWpm.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) /
    timelineWpm.length;
  const stddev = Math.sqrt(variance);
  const percent = mean > 0 ? Math.max(0, 100 - (stddev / mean) * 100) : 0;
  return Math.round(percent) + "%";
};

export const getTimelineData = () => ({
  wpm: timelineWpm,
  errors: timelineErrors,
  labels: timelineLabels,
});

export const updateResults = (stats) => {
  if (!engineFns) return;
  const startTime = engineFns.getStartTime();
  const timeLeft = engineFns.getTimeLeft();
  const timerSelect = engineFns.getTimerSelect();

  if (!startTime) {
    const results = document.getElementById("results-container");
    results.textContent = `Time left: ${timeLeft}s`;
    if (timelineChart) {
      timelineChart.destroy();
      timelineChart = null;
    }
    return;
  }

  updateProgressBar(timeLeft, timerSelect);

  const { wpm, accuracy } = stats;
  const timelineCtx = document
    .getElementById("timelineChart")
    ?.getContext("2d");
  if (timelineCtx) {
    if (timelineChart) timelineChart.destroy();
    timelineChart = new Chart(timelineCtx, {
      type: "line",
      data: {
        labels: timelineLabels.map((_, i) => (i + 1).toString()),
        datasets: [
          {
            label: "WPM",
            data: timelineWpm,
            borderColor: "#facc15",
            backgroundColor: "transparent",
            borderWidth: 3,
            fill: false,
            tension: 0.25,
            pointRadius: 2,
            pointBackgroundColor: "#facc15",
            pointBorderColor: "#facc15",
            yAxisID: "y",
            order: 1,
          },
          {
            label: "Errors",
            data: timelineErrors,
            borderColor: "#a3a3a3",
            backgroundColor: "transparent",
            borderWidth: 2,
            fill: false,
            tension: 0.25,
            pointRadius: 3,
            pointBackgroundColor: timelineErrors.map((e) =>
              e > 0 ? "#ef4444" : "#a3a3a3"
            ),
            pointBorderColor: timelineErrors.map((e) =>
              e > 0 ? "#ef4444" : "#a3a3a3"
            ),
            yAxisID: "y1",
            order: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "center",
            labels: {
              color: "#e5e5e5",
              font: { size: 15, weight: "bold" },
              usePointStyle: true,
              padding: 12,
              boxWidth: 18,
              boxHeight: 8,
              boxPadding: 2,
            },
          },
          title: { display: false },
          tooltip: {
            backgroundColor: "#23232a",
            titleColor: "#fde68a",
            bodyColor: "#fff",
            borderColor: "#fde68a",
            borderWidth: 1,
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Seconds",
              color: "#bcbcbc",
              font: { size: 16, weight: "bold" },
            },
            ticks: {
              color: "#bcbcbc",
              font: { size: 13 },
              callback: function (val, idx, ticks) {
                const labels = this.chart.data.labels;
                const total = labels.length;
                if (total > 30) {
                  return idx % 2 === 0 ? labels[idx] : "";
                }
                return labels[idx];
              },
            },
            grid: {
              color: "rgba(255,255,255,0.08)",
              drawOnChartArea: true,
              drawTicks: false,
              drawBorder: false,
            },
          },
          y: {
            type: "linear",
            position: "left",
            title: {
              display: true,
              text: "Words per Minute",
              color: "#facc15",
              font: { size: 16, weight: "bold" },
            },
            beginAtZero: true,
            ticks: {
              color: "#facc15",
              font: { size: 14 },
              stepSize: 20,
              callback: function (val) {
                return val % 20 === 0 ? val : "";
              },
            },
            grid: {
              color: "rgba(255,255,255,0.08)",
              drawOnChartArea: true,
              drawTicks: false,
              drawBorder: false,
            },
          },
          y1: {
            type: "linear",
            position: "right",
            title: {
              display: true,
              text: "Errors",
              color: "#ef4444",
              font: { size: 16, weight: "bold" },
            },
            beginAtZero: true,
            grid: {
              color: "rgba(255,255,255,0.08)",
              drawOnChartArea: false,
              drawTicks: false,
              drawBorder: false,
            },
            ticks: { color: "#ef4444", font: { size: 14 } },
          },
        },
      },
    });
  }
};
