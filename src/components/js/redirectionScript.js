const loginBtn = document.querySelectorAll('#login-btn');
const signUpBtn = document.getElementById('sign-up-btn');
const getStarted = document.querySelectorAll('#get-started-btn');

loginBtn.forEach((btn) =>
  btn.addEventListener('click', () => {
    setTimeout(
      () => (window.location.href = '/src/components/pages/login.html'),
      300,
    );
  }),
);

signUpBtn.addEventListener('click', () => {
  setTimeout(
    () => (window.location.href = '/src/components/pages/register.html'),
    300,
  );
});

getStarted.forEach((btn) =>
  btn.addEventListener('click', () => {
    setTimeout(
      () => (window.location.href = '/src/components/pages/game.html'),
      300,
    );
  }),
);
