const logout = () => {
  localStorage.removeItem('typing_game_user');
  localStorage.removeItem('typing_game_token');
  window.location.replace('/index.html');
};
