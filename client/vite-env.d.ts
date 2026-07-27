/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROXY_TARGET: string;
  // ajoute d’autres variables VITE si tu en as
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
