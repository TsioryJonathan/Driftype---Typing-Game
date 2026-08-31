const loginBtn = document.querySelectorAll('.login-btn');
const signUpBtn = document.getElementById('sign-up-btn');
const getStarted = document.querySelectorAll('.get-started-btn');

loginBtn.forEach((btn) =>
  btn.addEventListener('click', () => {
    setTimeout(
      () => (window.location.href = '/login'),
      300,
    );
  }),
);

signUpBtn.addEventListener('click', () => {
  setTimeout(
    () => (window.location.href = '/register'),
    300,
  );
});

getStarted.forEach((btn) =>
  btn.addEventListener('click', () => {
    setTimeout(
      () => (window.location.href = '/dashboard'),
      300,
    );
  }),
);
