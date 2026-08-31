import { clearAuth } from '../../utils/auth.js';

const logoutBtn = document.getElementById("logout-btn");

const logout = () => {
  clearAuth();
  window.location.replace("/index.html");
};

logoutBtn.addEventListener("click", logout);
