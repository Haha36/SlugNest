import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000';

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedRefresh = localStorage.getItem('refresh_token');
    
    if (storedToken && storedRefresh) {
      setToken(storedToken);
      // Optionally verify token is still valid by fetching user info
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify) => {
    try {
      setToken(tokenToVerify);
      setUser({ authenticated: true });
    } catch (error) {
      // Token invalid, clear it
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${DJANGO_API_URL}/auth/jwt/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMsg = errorData.detail || errorData.non_field_errors?.[0] || 'Invalid username or password';
        if (typeof errorMsg === 'string' && (errorMsg.includes('No active account') || errorMsg.includes('no_active_account'))) {
          errorMsg = 'Please enter a correct username and password.';
        }
        throw new Error(errorMsg);
      }

      const { access, refresh } = await response.json();
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setToken(access);
      setUser({ authenticated: true });

      return { success: true };
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return { success: false, error: 'Cannot connect to server.' };
      }
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch(`${DJANGO_API_URL}/auth/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.username?.[0] || 
                        errorData.email?.[0] || 
                        errorData.password?.[0] || 
                        errorData.detail ||
                        'Registration failed';
        throw new Error(errorMsg);
      }

      // Auto-login after successful registration
      return await login(username, password);
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return { success: false, error: 'Cannot connect to server. Please make sure the Django server is running.' };
      }
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      try {
        await fetch(`${DJANGO_API_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Clear tokens and user state
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
  };

  const getAuthHeaders = () => {
    if (!token) return {};
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    getAuthHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

