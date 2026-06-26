export async function generateStaticParams() {
  const fallback = [
    { unit: "sd", id: "1" },
    { unit: "smp", id: "1" }
  ];
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const res = await fetch(`${API_URL}/galeri`, { cache: 'no-store' });
    const items = await res.json();
    const list = Array.isArray(items) ? items : (items?.data || []);
    if (list.length === 0) return fallback;
    return [
      ...fallback,
      ...list.map((item: any) => ({
        unit: item.unit || "sd",
        id: String(item.id)
      }))
    ];
  } catch (error) {
    console.error("Failed to generate static params for admin galeri:", error);
    return fallback;
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
