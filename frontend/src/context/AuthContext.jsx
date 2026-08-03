import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const getApiBase = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'https://farmcall-project-1.onrender.com';
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('farmcall_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('farmcall_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isLoggedIn = Boolean(token);

  const fetchUserProfile = async (jwtToken, fallbackUsername) => {
    try {
      const apiBase = getApiBase();
      const response = await fetch(`${apiBase}/profile/`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      if (response.ok) {
        const profileData = await response.json();
        const userInfo = {
          name: profileData.name || fallbackUsername,
          username: profileData.username || fallbackUsername,
        };
        setUser(userInfo);
        return userInfo;
      }
    } catch (e) {
      console.warn('Could not fetch user profile details:', e);
    }
    const userInfo = { username: fallbackUsername };
    setUser(userInfo);
    return userInfo;
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('farmcall_token', token);
      if (!user?.name) {
        fetchUserProfile(token, user?.username || '');
      }
    } else {
      localStorage.removeItem('farmcall_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('farmcall_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('farmcall_user');
    }
  }, [user]);

  const login = async (username, password) => {
    try {
      const apiBase = getApiBase();
      const response = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const dataText = await response.text();

      if (!response.ok) {
        return { success: false, error: dataText || 'Invalid credentials' };
      }

      let parsedData;
      try {
        parsedData = JSON.parse(dataText);
      } catch (e) {
        parsedData = { jwtToken: dataText };
      }

      const jwtToken = parsedData.jwtToken;
      if (!jwtToken) {
        return { success: false, error: 'Token not received from server' };
      }

      setToken(jwtToken);
      await fetchUserProfile(jwtToken, username);

      return { success: true, token: jwtToken };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Unable to connect to server. Please ensure backend is running.' };
    }
  };

  const signup = async (name, username, password) => {
    try {
      const apiBase = getApiBase();
      const response = await fetch(`${apiBase}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, password }),
      });

      const dataText = await response.text();

      if (!response.ok) {
        return { success: false, error: dataText || 'Registration failed' };
      }

      return { success: true, message: dataText };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, error: 'Unable to connect to server. Please ensure backend is running.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('farmcall_token');
    localStorage.removeItem('farmcall_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
