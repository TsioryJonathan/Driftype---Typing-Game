const navUsername = document.querySelector('h2#username');
const usernameInput = document.querySelector('#username-input');
const emailInput = document.querySelectorAll('#email');
const usernameLabel = document.querySelector('#username-label');
const emailLabel = document.querySelector('#email-label');

const getUsernameNdEmail = async () => {
  if (localStorage.getItem('typing_game_user') === null) {
    navUsername.textContent = 'Guest';
    usernameInput.value = 'Guest';
    emailInput.value = 'Guest';
    emailLabel.textContent = 'Guest';
    usernameLabel.textContent = 'Guest';

    return 0;
  }

  const { id, email } = JSON.parse(localStorage.getItem('typing_game_user'));

  const response = await fetch(`http://localhost:3000/api/user/${id}`);

  if (!response.ok) throw new Error('User not found');

  const data = await response.json();
  const username = data[0].username;
  console.log(username);
  navUsername.innerText = username;

  usernameInput.value = username;
  emailInput.forEach((input) => (input.value = email));
  emailLabel.innerText = email;
  usernameLabel.innerText = username;
};

getUsernameNdEmail();
