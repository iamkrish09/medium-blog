import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import { verify } from 'hono/jwt';
import { COOKIE_NAME } from '../utils/cookies';

// Explicit env type so c.env and c.set are fully typed within the middleware
type AuthEnv = {
  Bindings: { JWT_SECRET: string };
  Variables: { userId: string };
};

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const token = getCookie(c, COOKIE_NAME);

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET, 'HS256');

    c.set('userId', payload.id as string);

    await next(); // Continue to the actual route
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
});