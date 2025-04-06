import { inputStyle, iconFormStyle, logoStyle, showPassword } from "../formStyle.js";


export const API_URL = 'http://localhost:3000/api' || process.env.API_URL;
export const TOKEN_KEY = "typing_game_token";
export const USER_KEY = "typing_game_user";
const DEFAULT_ERROR_MSG = "An error occurred. Please try again.";


document.addEventListener("DOMContentLoaded", () => {
  inputStyle();
  iconFormStyle();
  logoStyle();
  showPassword();
  initLogin();
});

const initLogin = () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) {
    console.error("Login form not found");
    return;
  }

  loginForm.addEventListener("submit", handleLogin);
};

const handleLogin = async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("errorMessage");
  const submitButton = e.target.querySelector("button[type='submit']");

  if (!validateInputs(email, password, errorElement)) return;

  try {
    setLoadingState(submitButton, true);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });

    if (!response.ok) {
      const data = await response.json();
      showError(errorElement, data.message || DEFAULT_ERROR_MSG);
      return;
    }

    const data = await response.json();
    storeAuthData(data.token, data.user);
    redirectToDashboard();
  } catch (error) {
    showError(errorElement, error.message || DEFAULT_ERROR_MSG);
  } finally {
    setLoadingState(submitButton, false);
  }
};

// Validate inputs
const validateInputs = (email, password, errorElement) => {
  if (!email || !password) {
    showError(errorElement, "Please fill in all fields");
    return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError(errorElement, "Please enter a valid email");
    return false;
  }

  return true;
};

// Set loading state
const setLoadingState = (button, isLoading) => {
  if (!button) return;

  button.disabled = isLoading;
  button.innerHTML = isLoading 
    ? '<span class="spinner">Loading...</span>' 
    : "Login";
};

// Store auth data
export const storeAuthData = (token, user) => {
  if (!token || !user) {
    console.error("Invalid auth data");
    return;
  }

  try {
    // safe storage of user data with expiration date (7 days)
    const userData = {
      ...user,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (e) {
    console.error("Storage error:", e);
    throw new Error("Failed to save authentication data");
  }
};

// Descomment for production
/*
const setAuthCookie = (token) => {
  document.cookie = `${
    TOKEN_KEY}=${token}; 
    Secure; 
    SameSite=Strict; 
    max-age=${7 * 24 * 60 * 60}; 
    path=/`;
};
*/

export const redirectToDashboard = () => {
  try {
    const redirectUrl = new URL("src/components/pages/dashboard.html", window.location.origin);
    window.location.replace(redirectUrl.toString());
  } catch (e) {
    console.error("Redirection error:", e);
    window.location.href = "/dashboard.html";
  }
};

export const showError = (element, message) => {
    if (!element) return;
    element.textContent = message;
    element.classList.remove('hidden');
    setTimeout(() => element.classList.add('hidden'), 5000);
  }
