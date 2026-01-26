import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [username, setUsernameState] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }, [username]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setUsername = (newUsername) => {
    setUsernameState(newUsername);
  };

  const setTheme = (nextTheme) => {
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const logout = () => {
    setUsernameState('');
    setThemeState('light');
  };

  const value = {
    username,
    setUsername,
    theme,
    setTheme,
    toggleTheme,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
