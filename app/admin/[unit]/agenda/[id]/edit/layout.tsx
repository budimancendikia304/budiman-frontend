export async function generateStaticParams() {
  const fallback = [
    { unit: "sd", id: "1" },
    { unit: "smp", id: "1" }
  ];
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const res = await fetch(`${API_URL}/agenda`, { cache: 'no-store' });
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
    console.error("Failed to generate static params for admin agenda:", error);
    return fallback;
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
