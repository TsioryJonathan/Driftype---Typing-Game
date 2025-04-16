const usernameField = document.querySelectorAll('h2#username');
const initial = document.querySelector('#initial');
const getUsernameNdEmail = async () => {
  const { id, email } = JSON.parse(localStorage.getItem('typing_game_user'));

  if (!id) return 'Guest';
  const response = await fetch(`http://localhost:3000/api/user/${id}`);
  if (!response.ok) throw new Error('User not found');
  const data = await response.json();
  const username = data[0].username;

  usernameField.forEach((field) => (field.innerText = username));
  initial.textContent = username[0];
};

getUsernameNdEmail();
