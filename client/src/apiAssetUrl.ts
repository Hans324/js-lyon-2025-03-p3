// modif noam
/**
 * Construit une URL complète vers un fichier servi par l’API (ex: /upload/...)
 * - évite les doubles slash
 * - laisse passer les URLs déjà complètes (http...)
 */
export function apiAssetUrl(
  base: string | undefined,
  path: string | null | undefined,
): string {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const b = (base ?? "").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;

  return `${b}${p}`;
}
