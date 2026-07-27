/**
 * Base pour les URLs API et fichiers uploadés, sans slash final.
 * Chaîne vide = même origine que le front (recommandé en dev avec le proxy Vite).
 * Sinon définir VITE_API_URL (ex. https://api.example.com) pour la prod.
 */
export function apiBaseUrl(): string {
  const v = import.meta.env.VITE_API_URL;
  if (v == null) return "";
  const s = String(v).trim();
  if (s === "") return "";
  return s.replace(/\/$/, "");
}
