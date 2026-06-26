export const IMAGE_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23F1F5F9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, sans-serif' font-weight='bold' font-size='14' fill='%2394A3B8'>Gambar Tidak Tersedia</text></svg>";

const getBackendBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    return apiUrl.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "");
  }
  return "http://localhost:8000";
};

export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath || typeof imagePath !== "string" || imagePath.trim() === "") {
    return IMAGE_PLACEHOLDER;
  }
  
  // If it's already a full URL or data URI, return it
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  
  // Clean up leading slashes
  const cleanPath = imagePath.replace(/^\/+/, "");
  const backendBaseUrl = getBackendBaseUrl();
  
  // If it already starts with storage/ or uploads/
  if (cleanPath.startsWith("storage/") || cleanPath.startsWith("uploads/")) {
    return `${backendBaseUrl}/${cleanPath}`;
  }
  
  // If it starts with common Laravel storage paths
  if (
    cleanPath.startsWith("galeri/") ||
    cleanPath.startsWith("prestasi/") ||
    cleanPath.startsWith("agenda/") ||
    cleanPath.startsWith("guru/") ||
    cleanPath.startsWith("ekstrakurikuler/") ||
    cleanPath.startsWith("program/") ||
    cleanPath.startsWith("fasilitas/") ||
    cleanPath.startsWith("pengumuman/")
  ) {
    return `${backendBaseUrl}/storage/${cleanPath}`;
  }
  
  // Default to uploads folder
  return `${backendBaseUrl}/uploads/${cleanPath}`;
}
