const logoutBtn = document.getElementById("logout-btn");

const logout = () => {
  localStorage.removeItem("typing_game_user");
  localStorage.removeItem("typing_game_token");
  window.location.replace("/index.html");
};

logoutBtn.addEventListener("click", logout);
