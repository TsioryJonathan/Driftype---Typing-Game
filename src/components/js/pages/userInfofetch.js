const navUsername = document.querySelector('h2#username');
const usernameInput = document.querySelector('#username-input');
const emailInput = document.querySelectorAll('#email');
const usernameLabel = document.querySelector('#username-label');
const emailLabel = document.querySelector('#email-label');

const getUsernameNdEmail = async () => {
  try {
    const userData = localStorage.getItem('typing_game_user');
    if (!userData) {
      console.debug('No user data found, setting as Guest');
      if (navUsername) navUsername.textContent = 'Guest';
      if (usernameInput) usernameInput.value = 'Guest';
      if (emailInput) emailInput.forEach(input => { if (input) input.value = 'Guest'; });
      if (emailLabel) emailLabel.textContent = 'Guest';
      if (usernameLabel) usernameLabel.textContent = 'Guest';
      return null;
    }

    const { id, email } = JSON.parse(userData);
    if (!id) {
      console.error('Invalid user data: no ID found');
      return null;
    }

    const response = await fetch(`http://localhost:3000/api/user/${id}`);
    if (!response.ok) {
      console.error('Failed to fetch user data:', response.statusText);
      return null;
    }

    const data = await response.json();
    if (!data || !data[0] || !data[0].username) {
      console.error('Invalid user data received from server');
      return null;
    }

    const username = data[0].username;
    console.debug('User data fetched successfully:', username);

    // Update UI elements if they exist
    if (navUsername) navUsername.textContent = username;
    if (usernameInput) usernameInput.value = username;
    if (emailInput) emailInput.forEach(input => { if (input) input.value = email; });
    if (emailLabel) emailLabel.textContent = email;
    if (usernameLabel) usernameLabel.textContent = username;

    return { id, username, email };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Only run if we're on a page that needs user info
if (document.querySelector('h2#username') || document.querySelector('#username-input')) {
  getUsernameNdEmail();
}
