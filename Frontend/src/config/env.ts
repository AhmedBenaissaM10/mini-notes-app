const raw = import.meta.env.VITE_API_BASE_URL;

if (!raw) {
  throw new Error(
    "VITE_API_BASE_URL is not set. Copy .env.example to .env and restart the dev server.",
  );
}

export const API_BASE_URL = raw.replace(/\/+$/, "");
