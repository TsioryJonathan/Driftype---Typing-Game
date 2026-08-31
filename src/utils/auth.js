const KEYS = {
  user: 'typing_game_user',
  token: 'typing_game_token',
};

export const getUser = () => {
  try {
    const raw = localStorage.getItem(KEYS.user);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getToken = () => localStorage.getItem(KEYS.token);
export const setUser = (user) => localStorage.setItem(KEYS.user, JSON.stringify(user));
export const setToken = (token) => localStorage.setItem(KEYS.token, token);
export const clearAuth = () => {
  localStorage.removeItem(KEYS.user);
  localStorage.removeItem(KEYS.token);
};
export const isAuthenticated = () => !!getToken() && !!getUser();
