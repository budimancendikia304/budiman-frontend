export async function generateStaticParams() {
  const fallback = [
    { unit: "sd", id: "1" },
    { unit: "smp", id: "1" }
  ];
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const res = await fetch(`${API_URL}/pengumuman`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON");
    }
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) return fallback;
    return [
      ...fallback,
      ...items.map((item: any) => ({
        unit: item.unit || "sd",
        id: String(item.id)
      }))
    ];
  } catch (error) {
    console.error("Failed to generate static params for pengumuman:", error);
    return fallback;
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
