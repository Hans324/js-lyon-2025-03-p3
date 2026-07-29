/** Nettoie une chaîne issue d’un formulaire (évite espaces parasites). */
export function sanitizeUserInput(value: string): string {
  return value.trim();
}
