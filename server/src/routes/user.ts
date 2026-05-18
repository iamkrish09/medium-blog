import { Hono } from "hono";
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '../generated/prisma/edge';
import { sign, verify } from 'hono/jwt';
import { signupInput, signinInput } from "@krishna1505/medium-common";
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { COOKIE_NAME, getCookieOptions, SESSION_TTL_SECONDS } from '../utils/cookies';
import { hashPassword, verifyPassword } from '../utils/password';

const JWT_ALGORITHM = 'HS256' as const;

//Fix pass as generic
export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
    NODE_ENV?: string;
  }
}>();

// =========================
// SIGN UP
// =========================

//the "c" here stands for contest which contains the request the response like everything in a consise way
userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const isProduction = c.env.NODE_ENV === 'production';
  //Get the body which the user will send me
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body)

  if (!success) {
    c.status(411);
    return c.json({
      message: "Invalid Input"
    })
  }

  //this also checks weather a siame user exists in the db
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: await hashPassword(body.password), // hashed with PBKDF2
        name: body.name,
      }
    })

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + SESSION_TTL_SECONDS;
    const token = await sign({ id: user.id, iat, exp }, c.env.JWT_SECRET, JWT_ALGORITHM)

    // Set HTTP-only cookie for the JWT token
    setCookie(
      c,
      COOKIE_NAME,
      token,
      getCookieOptions(isProduction)
    );

    return c.json({
      message: 'User created successfully!',
    }, 201);

  } catch (e) {
    c.status(411);
    return c.text('Error Occured While Sigining you up! A User Already Exists with same username')
  }
});


// =========================
// SIGN IN
// =========================

userRouter.post('/signin', async (c) => {

  try {
    const body = await c.req.json();

    const { success } = signinInput.safeParse(body);

    if (!success) {
      c.status(411);
      return c.json({ message: "Invalid Input" }, 400);
    }

    const prisma = new PrismaClient({
      accelerateUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    // const body = await c.req.json();

    if (!body.email || !body.password) {
      return c.json({ error: "Email and password required" }, 400);
    }

    const user = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    });

    if (!user) {
      return c.json({ error: "User not found" }, 403);
    }

    const passwordMatch = await verifyPassword(body.password, user.password);
    if (!passwordMatch) {
      return c.json({ error: "Invalid credentials" }, 403);
    }

    if (!c.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is undefined");
    }

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + SESSION_TTL_SECONDS;
    const token = await sign(
      { id: user.id, iat, exp },
      c.env.JWT_SECRET,
      JWT_ALGORITHM
    );

    const isProduction = c.env.NODE_ENV === 'production';

    setCookie(
      c,
      COOKIE_NAME,
      token,
      getCookieOptions(isProduction)
    );
    return c.json({
      // jwt,
      message: 'Login Successful!'
    });

  } catch (error) {
    console.error("[ERROR] Signin failed:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// =========================
// LOGOUT
// =========================
userRouter.post('/logout', async (c) => {
  deleteCookie(c, COOKIE_NAME, {
    path: '/',
  });

  return c.json({
    message: 'Logged out successfully',
  });
});

// =========================
// GET CURRENT USER
// =========================
userRouter.get('/me', async (c) => {
  try {
    const token = getCookie(c, COOKIE_NAME);

    if (!token) {
      return c.json({ authenticated: false }, 401);
    }

    const payload = await verify(
      token,
      c.env.JWT_SECRET,
      JWT_ALGORITHM
    );

    const prisma = new PrismaClient({
      accelerateUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id as string,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return c.json({ authenticated: false }, 401);
    }

    return c.json({
      authenticated: true,
      user,
    });
  } catch {
    return c.json({ authenticated: false }, 401);
  }
});