interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_BOOKING_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
