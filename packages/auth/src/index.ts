import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { Context, Next } from 'hono';

// Auth0 configuration
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;

if (!AUTH0_DOMAIN || !AUTH0_AUDIENCE) {
  console.warn('⚠️ Warning: AUTH0_DOMAIN and AUTH0_AUDIENCE must be set in environment variables');
}

// JWKS endpoint for token verification
const JWKS = AUTH0_DOMAIN ? createRemoteJWKSet(
  new URL(`https://${AUTH0_DOMAIN}/.well-known/jwks.json`)
) : null;

export interface User {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  [key: string]: any;
}

/**
 * Auth0 middleware for Hono
 * Verifies JWT tokens from Auth0
 */
export const authMiddleware = async (c: Context, next: Next) => {
  try {
    // Extract token from Authorization header
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }

    const token = authHeader.substring(7);

    if (!JWKS || !AUTH0_DOMAIN || !AUTH0_AUDIENCE) {
      return c.json({ error: 'Server configuration error: Auth0 not configured' }, 500);
    }

    // Verify the JWT token
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://${AUTH0_DOMAIN}/`,
      audience: AUTH0_AUDIENCE,
    });

    // Add user to context
    c.set('user', payload as User);

    await next();
  } catch (error) {
    console.error('Authentication error:', error);
    return c.json({ 
      error: 'Unauthorized: Invalid token',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 401);
  }
};

/**
 * Optional auth middleware - doesn't fail if no token is provided
 * but validates token if present
 */
export const optionalAuthMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    if (JWKS && AUTH0_DOMAIN && AUTH0_AUDIENCE) {
      try {
        const { payload } = await jwtVerify(token, JWKS, {
          issuer: `https://${AUTH0_DOMAIN}/`,
          audience: AUTH0_AUDIENCE,
        });

        c.set('user', payload as User);
      } catch (error) {
        console.error('Optional auth verification failed:', error);
        // Continue without user context
      }
    }
  }

  await next();
};

/**
 * Get user from context (for use in route handlers)
 */
export const getUser = (c: Context): User | null => {
  return c.get('user') || null;
};

export { type Context };
