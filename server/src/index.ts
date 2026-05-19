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

app.use(
  '/*',
  cors({
    origin: [
      'http://localhost:5173',
      'https://scryb.krishnapramanik.in',
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    credentials: true,
  })
)

app.route("/api/v1/user", userRouter);
app.route("/api/v1/post", postRouter);

export default app;