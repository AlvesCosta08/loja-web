const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Converte a URL relativa do backend em URL absoluta.
 * Ex: "/products/images/x.png" -> "http://localhost:8080/products/images/x.png"
 * Se já for absoluta ("http://..."), retorna como está.
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}