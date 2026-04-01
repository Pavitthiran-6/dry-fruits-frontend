import { createSlice } from '@reduxjs/toolkit';
import { validateToken, getStoredToken } from '../../utils/jwt';

// Get stored auth data from localStorage
const getStoredAuth = () => {
  try {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);

      // Validate admin token if exists
      if (parsedAuth.adminToken) {
        const tokenValidation = validateToken(parsedAuth.adminToken);
        if (tokenValidation.valid) {
          return {
            isAdminAuthenticated: true,
            adminUser: parsedAuth.adminUser,
            adminToken: parsedAuth.adminToken
          };
        } else {
          // Token invalid or expired, clear admin data
          delete parsedAuth.isAdminAuthenticated;
          delete parsedAuth.adminUser;
          delete parsedAuth.adminToken;
          localStorage.setItem('auth', JSON.stringify(parsedAuth));
        }
      }

      // Return user auth data if exists
      if (parsedAuth.isAuthenticated && parsedAuth.user) {
        return {
          user: parsedAuth.user,
          isAuthenticated: parsedAuth.isAuthenticated
        };
      }
    }
  } catch (error) {
    console.error('Error reading auth from localStorage:', error);
  }
  return null;
};

const storedAuth = getStoredAuth();

const initialState = storedAuth || {
  user: null,
  isAuthenticated: false,
  isAdminAuthenticated: false,
  adminUser: null,
  adminToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      // Save to localStorage
      localStorage.setItem('auth', JSON.stringify({
        user: action.payload,
        isAuthenticated: true,
      }));
    },
    // Admin login with JWT
    adminLoginSuccess: (state, action) => {
      state.loading = false;
      state.isAdminAuthenticated = true;
      state.adminUser = action.payload.user;
      state.adminToken = action.payload.token;
    },
    // Validate and restore admin session from token
    validateAdminSession: (state) => {
      const token = getStoredToken();
      if (token) {
        const validation = validateToken(token);
        if (validation.valid) {
          const storedAuth = JSON.parse(localStorage.getItem('auth') || '{}');
          state.isAdminAuthenticated = true;
          state.adminUser = storedAuth.adminUser;
          state.adminToken = token;
        } else {
          // Token expired or invalid
          state.isAdminAuthenticated = false;
          state.adminUser = null;
          state.adminToken = null;
        }
      }
    },
    // Admin logout
    adminLogout: (state) => {
      state.adminUser = null;
      state.isAdminAuthenticated = false;
      state.adminToken = null;
      // Remove admin data from localStorage
      const currentAuth = localStorage.getItem('auth');
      if (currentAuth) {
        const parsedAuth = JSON.parse(currentAuth);
        delete parsedAuth.isAdminAuthenticated;
        delete parsedAuth.adminUser;
        delete parsedAuth.adminToken;
        localStorage.setItem('auth', JSON.stringify(parsedAuth));
      }
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Remove from localStorage
      localStorage.removeItem('auth');
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      // Save to localStorage
      localStorage.setItem('auth', JSON.stringify({
        user: action.payload,
        isAuthenticated: true,
      }));
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      // Update localStorage
      if (state.isAuthenticated && state.user) {
        localStorage.setItem('auth', JSON.stringify({
          user: state.user,
          isAuthenticated: true,
        }));
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  updateProfile,
  adminLoginSuccess,
  validateAdminSession,
  adminLogout,
} = authSlice.actions;

export default authSlice.reducer;
