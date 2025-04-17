const practiceBtn = document.querySelector('#practice-btn');
const settingBtn = document.querySelector('#setting-btn');
const statBtn = document.querySelector('#stat-btn');

practiceBtn.addEventListener('click', () => {
  window.location.href = '/src/components/pages/dashboard.html';
});
settingBtn.addEventListener('click', () => {
  window.location.href = '/src/components/pages/settingPage.html';
});
statBtn.addEventListener('click', () => {
  window.location.href = '/src/components/pages/gameStat.html';
});
