const usernameField = document.querySelectorAll('h2#username');
const initial = document.querySelector('#initial');

const getUsernameNdEmail = async () => {
  if (localStorage.getItem('typing_game_user') == null) {
    usernameField.forEach((field) => (field.innerText = 'Guest'));
    initial.textContent = 'G';
    return;
  }

  const { id } = JSON.parse(localStorage.getItem('typing_game_user'));

  const response = await fetch(`http://localhost:3000/api/user/${id}`);
  if (!response.ok) throw new Error('User not found');
  const data = await response.json();
  const username = data[0].username;

  usernameField.forEach((field) => (field.innerText = username));
  initial.textContent = username[0];
};

getUsernameNdEmail();
