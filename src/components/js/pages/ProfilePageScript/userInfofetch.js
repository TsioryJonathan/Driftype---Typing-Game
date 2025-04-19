const usernameField = document.querySelectorAll('#username');
const navUsername = document.querySelector('#nav_username');
const initial = document.querySelector('#initial');

console.log(navUsername);

const getUsernameNdEmail = async () => {
  if (!localStorage.getItem('typing_game_user')) {
    usernameField.forEach((field) => (field.innerText = 'Guest'));
    initial.textContent = 'G';
    navUsername.textContent = 'Guest';
    return null;
  }

  const { id } = JSON.parse(localStorage.getItem('typing_game_user'));

  const response = await fetch(`http://localhost:3000/api/user/${id}`);
  if (!response.ok) throw new Error('User not found');
  const data = await response.json();
  const username = data[0].username;
  navUsername.textContent = username;
  usernameField.forEach((field) => (field.innerText = username));
  initial.textContent = username[0];
};

getUsernameNdEmail();
