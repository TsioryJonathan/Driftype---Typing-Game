const logout = () => {
  localStorage.removeItem('typing_game_user');
  localStorage.removeItem('typing_game_token');
  window.location.href = '/index.html';
};
