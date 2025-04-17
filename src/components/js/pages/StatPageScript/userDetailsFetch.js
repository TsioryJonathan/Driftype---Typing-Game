const usernameH2 = document.querySelector('#username');

const getUsername = async () => {
  const { id } = JSON.parse(localStorage.getItem('typing_game_user'));

  if (!id) return 'Guest';
  const response = await fetch(`http://localhost:3000/api/user/${id}`);
  if (!response.ok) throw new Error('User not found');
  const data = await response.json();
  const username = data[0].username;
  usernameH2.innerText = username;
};

getUsername();
