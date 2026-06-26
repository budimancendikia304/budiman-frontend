export async function generateStaticParams() {
  const fallback = [
    { unit: "sd", slug: "default" },
    { unit: "smp", slug: "default" }
  ];
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const res = await fetch(`${API_URL}/berita`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON");
    }
    const json = await res.json();
    const items = json?.data || [];
    if (items.length === 0) return fallback;
    return [
      ...fallback,
      ...items.map((item: any) => ({
        unit: item.unit || "sd",
        slug: item.slug || "default"
      }))
    ];
  } catch (error) {
    console.error("Failed to generate static params for berita:", error);
    return fallback;
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
