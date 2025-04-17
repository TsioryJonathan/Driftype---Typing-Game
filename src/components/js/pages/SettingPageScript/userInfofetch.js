const navUsername = document.querySelector('h2#username');
const usernameInput = document.querySelector('#username-input');
const emailInput = document.querySelector('#email');
const usernameLabel = document.querySelector('#username-label');
const emailLabel = document.querySelector('#email-label');

const getUsernameNdEmail = async () => {
  const { id, email } = JSON.parse(localStorage.getItem('typing_game_user'));

  if (!id) {
    navUsername.textContent = 'Guest';
    usernameInput.value = 'Guest';
    emailInput.value = 'Guest';
    emailLabel.textContent = 'Guest';
    usernameLabel.textContent = 'Guest';

    return;
  }
  const response = await fetch(`http://localhost:3000/api/user/${id}`);
  if (!response.ok) throw new Error('User not found');
  const data = await response.json();
  const username = data[0].username;
  console.log(username);
  navUsername.innerText = username;

  usernameInput.value = username;
  emailInput.value = email;
  emailLabel.innerText = email;
  usernameLabel.innerText = username;
};

getUsernameNdEmail();
