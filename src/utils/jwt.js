// JWT Utility Functions
// Since there's no backend, we simulate JWT token generation and validation

// Base64 URL encoding helper
const base64UrlEncode = (str) => {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

// Generate a simulated JWT token
export const generateToken = (payload, expiresInDays = 7) => {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    
    const now = Math.floor(Date.now() / 1000);
    const exp = now + (expiresInDays * 24 * 60 * 60); // 7 days in seconds
    
    const tokenPayload = {
        ...payload,
        iat: now,
        exp: exp
    };
    
    // Create simulated JWT parts
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
    
    // Simulate signature (in production, this would be server-generated)
    const signature = base64UrlEncode(`${encodedHeader}.${encodedPayload}.secret-key`);
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// Validate JWT token
export const validateToken = (token) => {
    if (!token) {
        return { valid: false, error: 'No token provided' };
    }
    
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return { valid: false, error: 'Invalid token format' };
        }
        
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        
        // Check expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            return { valid: false, error: 'Token expired' };
        }
        
        return { valid: true, payload };
    } catch (error) {
        return { valid: false, error: 'Invalid token' };
    }
};

// Get token from localStorage
export const getStoredToken = () => {
    try {
        const authData = localStorage.getItem('auth');
        if (authData) {
            const parsed = JSON.parse(authData);
            return parsed.adminToken || null;
        }
    } catch (error) {
        console.error('Error reading token from localStorage:', error);
    }
    return null;
};

// Store token in localStorage
export const storeToken = (token, adminUser) => {
    try {
        const authData = {
            adminToken: token,
            adminUser: adminUser,
            isAdminAuthenticated: true
        };
        localStorage.setItem('auth', JSON.stringify(authData));
    } catch (error) {
        console.error('Error storing token:', error);
    }
};

// Remove token from localStorage
export const removeToken = () => {
    try {
        const authData = localStorage.getItem('auth');
        if (authData) {
            const parsed = JSON.parse(authData);
            delete parsed.adminToken;
            delete parsed.adminUser;
            delete parsed.isAdminAuthenticated;
            localStorage.setItem('auth', JSON.stringify(parsed));
        }
    } catch (error) {
        console.error('Error removing token:', error);
    }
};

// Create Authorization header
export const getAuthHeader = () => {
    const token = getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
