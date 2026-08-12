/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const ACCESS_KEY  = 'gv_access';
const REFRESH_KEY = 'gv_refresh';
const USER_KEY    = 'gv_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem(ACCESS_KEY));
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Keep axios default header in sync with the stored token
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);

  // Stable refs so callbacks never go stale
  const setUserRef         = useRef(setUser);
  const setAccessTokenRef  = useRef(setAccessToken);
  useEffect(() => {
    setUserRef.current        = setUser;
    setAccessTokenRef.current = setAccessToken;
  }, [setUser, setAccessToken]);

  const persist = useCallback((data) => {
    localStorage.setItem(ACCESS_KEY,  data.access);
    localStorage.setItem(REFRESH_KEY, data.refresh);
    localStorage.setItem(USER_KEY,    JSON.stringify(data.user));
    setAccessTokenRef.current(data.access);
    setUserRef.current(data.user);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    setAccessTokenRef.current(null);
    setUserRef.current(null);
  }, []);

  const register = useCallback(async ({ username, email, password, password2 }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register/', { username, email, password, password2 });
      persist(data);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data || { detail: 'Registration failed.' };
      setError(msg);
      return { success: false, errors: msg };
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login/', { email, password });
      persist(data);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data || { detail: 'Login failed.' };
      setError(msg);
      return { success: false, errors: msg };
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const googleLogin = useCallback(async (credential) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/google/', { credential });
      persist(data);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data || { detail: 'Google login failed.' };
      setError(msg);
      return { success: false, errors: msg };
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const logout = useCallback(() => {
    clear();
  }, [clear]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        error,
        register,
        login,
        googleLogin,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
