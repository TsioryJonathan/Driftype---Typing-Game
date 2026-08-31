const practiceBtn = document.querySelector('#practice-btn');
const settingBtn = document.querySelector('#setting-btn');
const statBtn = document.querySelector('#stat-btn');

practiceBtn.addEventListener('click', () => {
  window.location.href = '/dashboard';
});
settingBtn.addEventListener('click', () => {
  window.location.href = '/setting';
});
statBtn.addEventListener('click', () => {
  window.location.href = '/statistics';
});
