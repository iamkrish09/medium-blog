import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRouter } from './routes/user';
import { postRouter } from './routes/post';


//Fix pass as generic
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string
	}
}>();
// app.use('/*', cors());
app.use(
  '/*',
  cors({
    origin: ['http://localhost:5173'], // replace/expand via env per deployment
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);
app.route("/api/v1/user", userRouter);
app.route("/api/v1/post", postRouter);

export default app;

/*

!
!
!
Middlewwares
!
!
!
  // get the header
  // verify the header
  // if the header is correct, we need can proceed
  // if not, we return the user a 403 status code

*/

// Extract and save access_token to a global variable

// app.use('/api/v1/post/*', async (c, next) => {

//   const header = c.req.header("authorization") || "";

//   //Bearer Token
//   const token = header.split("")[1]

//   const response = await verify(token, c.env.JWT_SECRET)
//   if (response.id) {
//     next()
//   } else{
//     c.status(403)
//     return c.json({error: "unauthorized"})
//   } 
//   // await next()
// })



// import { Hono } from "hono";
// import { PrismaClient } from "@prisma/client/edge";
// import { withAccelerate } from "@prisma/extension-accelerate";
// import { sign } from "hono/jwt";

// const app = new Hono<{
//   Bindings: {
//     DATABASE_URL: string;
//     JWT_SECRET: string;
//   };
// }>();

// // ✅ Signup Route
// app.post("/api/v1/signup", async (c) => {
//   try {
//     // ✅ Use Prisma Accelerate connection
//     const prisma = new PrismaClient({
//       datasourceUrl: c.env.DATABASE_URL,
//     }).$extends(withAccelerate());

//     const body = await c.req.json();
//     const { email, password } = body;

//     if (!email || !password) {
//       return c.json({ error: "Email and password are required" }, 400);
//     }

//     // ✅ Create a new user
//     const user = await prisma.user.create({
//       data: {
//         email,
//         password,
//       },
//     });

//     // ✅ Generate JWT
//     const token = await sign({ id: user.id }, c.env.JWT_SECRET);

//     return c.json({ jwt: token }, 201);
//   } catch (err: any) {
//     // console.error("Signup Error:", err);
//     return c.json(
//       {
//         error: "Internal Server Error",
//         message: err.message,
//       },
//       500
//     );
//   }
// });

// // ✅ Other routes
// app.post("/api/v1/signin", (c) => c.text("Signin route working"));
// app.post("/api/v1/post", (c) => c.text("post route working"));
// app.put("/api/v1/post", (c) => c.text("post PUT route working"));
// app.get("/api/v1/post/:id", (c) => c.text("Single post route working"));

// export default app;
