export const BACKEND_URL_DEV = import.meta.env.VITE_BACKEND_DEV as string;
export const BACKEND_URL_PROD = import.meta.env.VITE_BACKEND_URL_PROD as string;

// import.meta.env.DEV  → true  when running `npm run dev`  (Vite dev server)
// import.meta.env.PROD → true  when running `npm run build` (production bundle)
// No manual toggling needed — Vite switches this automatically.
export const BACKEND_URL = import.meta.env.DEV ? BACKEND_URL_DEV : BACKEND_URL_PROD;