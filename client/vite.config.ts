import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_PROXY_TARGET || "http://127.0.0.1:3310";

  const proxy = {
    "/api": {
      target: apiTarget,
      changeOrigin: true,
    },
    "/upload": {
      target: apiTarget,
      changeOrigin: true,
    },
  };

  return {
    plugins: [react()],
    server: {
      port: 3000,
      // En dev : le navigateur appelle http://localhost:3000/api/... (même origine).
      // Vite transmet au backend → plus de CORS bloqué par le navigateur.
      proxy,
    },
    preview: {
      port: 4173,
      proxy,
    },
  };
});
