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
