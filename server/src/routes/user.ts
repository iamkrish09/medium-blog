import { Hono } from "hono";
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '../generated/prisma/edge';
import { sign } from 'hono/jwt';
import { signupInput, signinInput } from "@krishna1505/medium-common";

const JWT_ALGORITHM = 'HS256' as const;

//Fix pass as generic
export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>();

//SIGN UP

//the "c" here stands for contest which contains the request the response like everything in a consise way
userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

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
        password: body.password,
        name: body.name,
      }
    })

    const token = await sign({ id: user.id }, c.env.JWT_SECRET, JWT_ALGORITHM)
    c.status(200);
    return c.json({
      jwt: token,
      message: 'User created successfully!',
    })

  } catch (e) {
    c.status(411);
    return c.text('Error Occured While Sigining you up! A User Already Exists with same username')
  }
})



userRouter.post('/signin', async (c) => {

  try {
    const body = await c.req.json();

    const { success } = signinInput.safeParse(body);

    if (!success) {
      c.status(411);
      return c.json({ message: "Invalid Input" });
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

    console.log("🟡 [10] Verifying password");

    if (user.password !== body.password) {
      return c.json({ error: "Invalid credentials" }, 403);
    }

    if (!c.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is undefined");
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET, JWT_ALGORITHM);

    return c.json({
      jwt,
      message: 'Login Successful!'
    });

  } catch (error) {
    console.error("[ERROR] Signin failed:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});
