import { createContext, useContext, useState, useEffect } from 'react';
import API_URL from '../config/api';

const AuthContext = createContext(null);

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = getStoredToken();

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setToken(storedToken);
        } else {
          if (typeof window !== 'undefined') localStorage.removeItem('adminToken');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        if (typeof window !== 'undefined') localStorage.removeItem('adminToken');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (typeof window !== 'undefined') localStorage.setItem('adminToken', data.token);
      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('adminToken');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};