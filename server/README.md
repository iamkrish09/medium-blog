## Setup

Install dependencies and start the Worker locally:

```txt
npm install
npm run dev
```

Deploy the Worker:

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

## Required environment variables

This server uses two different database URLs:

- `DATABASE_URL`: the Prisma Accelerate `prisma://...` URL used by the Worker at runtime.
- `DIRECT_DATABASE_URL`: the direct Postgres `postgres://...` URL used by Prisma CLI commands such as `prisma migrate`, `prisma db pull`, `prisma validate`, and `prisma generate` through [`prisma.config.ts`](./prisma.config.ts).

Set both values for local development:

- In [`wrangler.jsonc`](./wrangler.jsonc), set `DATABASE_URL` to the Accelerate proxy URL and `DIRECT_DATABASE_URL` to the direct Postgres connection string.
- In [`server/.env`](./.env), keep the same values so Prisma CLI can load `DIRECT_DATABASE_URL` locally.

## Where to get DIRECT_DATABASE_URL

`DIRECT_DATABASE_URL` must be the normal direct connection string from your Postgres provider, not the Accelerate proxy URL.

- For Aiven, copy the PostgreSQL service URI from the service overview or connection information page.
- For other providers such as Neon, Supabase, RDS, or Railway, copy the standard Postgres connection string from the database dashboard.
- The value should start with `postgres://` or `postgresql://` and usually includes host, port, database name, username, password, and any required SSL options.

Do not use the `prisma://accelerate.prisma-data.net/...` URL for `DIRECT_DATABASE_URL`.

## CI / deployment notes

CI jobs that run Prisma CLI commands also need `DIRECT_DATABASE_URL` in addition to `DATABASE_URL`.

- Add `DIRECT_DATABASE_URL` to your CI secret store as the direct Postgres connection string.
- Add `DATABASE_URL` to your CI secret store as the Prisma Accelerate URL used by the Worker runtime.
- Run Prisma commands from the `server` directory so `prisma.config.ts` is picked up automatically.
























# The Cookie Authentication Flow: A Simple Walkthrough

Think of authentication like visiting a secure building. Previously, you were given a paper ID card (the token in `localStorage`) that you had to remember to show the guard every time you walked through a door. 

Now, with HTTP-only cookies, the building gives you a tamper-proof wristband. You don't have to remember to show it; the building's sensors (the browser) detect it automatically on your wrist every time you try to open a door.

Here is exactly how that works in your app right now.

---

## 1. Logging In (Getting the Wristband)

**What you do:** You type your email and password and click "Sign in".
**Frontend:** `apiClient.post('/api/v1/user/signin')` sends your credentials to the server.

**Server:**
1. Checks the database to see if your email and password match.
2. If they match, it creates a JWT (JSON Web Token) with your user ID.
3. Instead of sending the JWT back in the main body of the response, it tells the browser: *"Hey, put this JWT inside a locked box called `krishna_blogging_token` and don't let anyone touch it."* This is done using the `Set-Cookie` header with the `httpOnly: true` flag.

**Frontend:** Receives a "Login Successful!" message. The browser silently saves the cookie. Your frontend code never actually sees or touches the token.

---

## 2. Navigating the App (The Bouncer Check)

**What you do:** You try to visit `/blogs` or you refresh the page.
**Frontend (`ProtectedRoute.tsx`):** Before rendering the page, the app needs to know if you are allowed in.
1. It sends a request to the server: `apiClient.get('/api/v1/user/me')`.
2. **The Magic:** Because we set `withCredentials: true` in our `apiClient`, the browser says, *"Oh, you're talking to the server? Let me automatically attach that locked box (`krishna_blogging_token`) to the request."*

**Server (`/me` route):**
1. Receives the request.
2. Looks for the `krishna_blogging_token` cookie.
3. Opens the locked box, verifies the JWT inside, and says, *"Yes, this is user X. They are authenticated."*
4. Sends back `{ authenticated: true, user: {...} }`.

**Frontend (`ProtectedRoute.tsx`):** Hears "Yes, they are authenticated" and lets you into the `/blogs` page.

---

## 3. Creating a Post (Using the Wristband)

**What you do:** You type a blog post and click "Publish".
**Frontend (`Publish.tsx`):** Calls `apiClient.post('/api/v1/post', { title, content })`. It does **not** attach an `Authorization` header.

**The Browser's Job:** Just like before, the browser automatically attaches your cookie to the request.

**Server (`authMiddleware`):**
Before the request reaches the logic that saves the post to the database, it goes through the `authMiddleware`:
1. The middleware checks for the cookie.
2. If the cookie is missing or invalid, it immediately rejects the request with a `401 Unauthorized`.
3. If the cookie is valid, it reads your User ID from it, attaches it to the request (`c.set('userId', id)`), and lets the request pass through to create the post.

---

## 4. Logging Out (Cutting off the Wristband)

**What you do:** You click the "Logout" button in the Appbar.
**Frontend:** Calls `apiClient.post('/api/v1/user/logout')`.

**Server:**
1. Receives the logout request.
2. Sends a response back telling the browser: *"Delete the `krishna_blogging_token` cookie immediately."* (It sets the cookie's expiration date to the past).

**Frontend:**
1. Receives the successful response.
2. The browser automatically deletes the cookie.
3. The frontend clears its memory of you being authenticated (clears the TanStack query cache).
4. Navigates you back to `/signin`.

---

### Why is this better?

* **It's easier for the frontend:** You no longer have to manually fetch the token from `localStorage` and manually attach it to the headers of every single request. The browser does all the heavy lifting automatically.
* **It's much more secure:** Because the cookie is marked as `httpOnly`, malicious JavaScript (like a bad browser extension or an XSS attack) cannot read the token. With `localStorage`, any script on the page could easily steal your token.

