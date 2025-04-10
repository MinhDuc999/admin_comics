import { AuthBindings } from '@refinedev/core';
import { jwtDecode } from 'jwt-decode';

export const authProvider: AuthBindings = {
  login: async ({ credential }: any) => {
    if (credential) {
      try {
        localStorage.setItem('auth', JSON.stringify({ credential }));
        const decoded: any = jwtDecode(credential);
        console.log('Login successful, token decoded:', decoded);

        return {
          success: true,
          redirectTo: '/',
        };
      } catch (error) {
        console.error('Login error - Failed to decode token:', error);
        localStorage.removeItem('auth');
        return {
          success: false,
          error: {
            name: 'LoginError',
            message: 'Invalid token format',
          },
        };
      }
    }

    console.error('Login error - No credential provided');
    return {
      success: false,
      error: {
        name: 'LoginError',
        message: 'No credentials provided',
      },
    };
  },

  logout: async () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('access_token');

    return {
      success: true,
      redirectTo: '/login',
    };
  },

  check: async () => {
    const auth = localStorage.getItem('auth');

    if (auth) {
      try {
        const { credential } = JSON.parse(auth);
        const decoded: any = jwtDecode(credential);

        const currentTime = Date.now() / 1000;
        console.log('Auth check - Token info:', {
          subject: decoded.sub,
          expiresAt: new Date(decoded.exp * 1000).toISOString(),
          isExpired: decoded.exp < currentTime,
        });
        if (decoded.exp && decoded.exp < currentTime) {
          console.warn('Token expired, redirecting to login');
          localStorage.removeItem('auth');
          return {
            authenticated: false,
            redirectTo: '/login',
            error: {
              name: 'TokenExpiredError',
              message: 'Your session has expired. Please login again.',
            },
          };
        }

        console.log('Auth check successful, user is authenticated');
        return {
          authenticated: true,
        };
      } catch (error) {
        console.error('Auth check error - Token invalid:', error);
        localStorage.removeItem('auth');
        return {
          authenticated: false,
          redirectTo: '/login',
          error: {
            name: 'TokenInvalidError',
            message: 'Invalid authentication token',
          },
        };
      }
    }

    console.log('Auth check failed, no auth data found');
    return {
      authenticated: false,
      redirectTo: '/login',
    };
  },

  getPermissions: async () => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      try {
        const { credential } = JSON.parse(auth);
        const decoded: any = jwtDecode(credential);
        const roles = decoded.roles || ['admin'];
        console.log('Permissions retrieved:', roles);
        return roles;
      } catch (error) {
        console.error('Error getting permissions:', error);
      }
    }
    return null;
  },

  getIdentity: async () => {
    const auth = localStorage.getItem('auth');

    if (auth) {
      try {
        const { credential } = JSON.parse(auth);
        const decoded: any = jwtDecode(credential);

        const identity = {
          id: decoded.sub,
          name: decoded.name || decoded.email,
          avatar: decoded.picture,
          email: decoded.email,
        };

        console.log('Identity retrieved:', identity);
        return identity;
      } catch (error) {
        console.error('Error decoding token for identity:', error);
      }
    }

    return null;
  },

  onError: async (error) => {
    console.error('Auth provider error:', error);
    const status = error?.response?.status;
    const isAuthError = status === 401 || status === 403;

    if (isAuthError) {
      localStorage.removeItem('auth');
      return {
        error,
        logout: true,
        redirectTo: '/login',
      };
    }

    return { error };
  },
};
