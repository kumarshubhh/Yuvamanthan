import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// ✅ Backend Base URL (deployed)
const API_BASE_URL = "https://yuvamanthan.onrender.com";

// Set Axios base URL globally
axios.defaults.baseURL = API_BASE_URL;

// Types
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  bio: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
};

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Axios default Authorization setup
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const response = await axios.get('/api/auth/me');
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: response.data.user, token: state.token },
          });
        } catch {
          dispatch({ type: 'AUTH_FAILURE' });
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE' });
      }
    };

    loadUser();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.data.user, token: response.data.token },
      });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // Register
  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.data.user, token: response.data.token },
      });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Update profile
  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await axios.put('/api/auth/profile', data);
      dispatch({ type: 'UPDATE_USER', payload: response.data.user });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
