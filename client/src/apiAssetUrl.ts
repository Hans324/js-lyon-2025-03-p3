/** Construit l’URL absolue d’un fichier uploadé renvoyé par l’API (ex. `/upload/ship1.webp`). */
export function apiAssetUrl(
  baseURL: string | undefined,
  imagePath: string | null | undefined,
): string {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const root = (baseURL ?? "").replace(/\/$/, "");
  const path = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${root}${path}`;
}
