export async function generateStaticParams() {
  const fallback = [
    { unit: "sd", id: "1" },
    { unit: "smp", id: "1" }
  ];
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const resSD = await fetch(`${API_URL}/guru?unit=sd`, { cache: 'no-store' });
    if (!resSD.ok) throw new Error(`HTTP error! status: ${resSD.status}`);
    const ctSD = resSD.headers.get("content-type");
    if (!ctSD || !ctSD.includes("application/json")) throw new Error("Response is not JSON");
    const sdItems = await resSD.json();
    
    const resSMP = await fetch(`${API_URL}/guru?unit=smp`, { cache: 'no-store' });
    if (!resSMP.ok) throw new Error(`HTTP error! status: ${resSMP.status}`);
    const ctSMP = resSMP.headers.get("content-type");
    if (!ctSMP || !ctSMP.includes("application/json")) throw new Error("Response is not JSON");
    const smpItems = await resSMP.json();
    
    const items = [
      ...(Array.isArray(sdItems) ? sdItems : []),
      ...(Array.isArray(smpItems) ? smpItems : [])
    ];
    
    if (items.length === 0) return fallback;
    return [
      ...fallback,
      ...items.map((item: any) => ({
        unit: item.unit || "sd",
        id: String(item.id)
      }))
    ];
  } catch (error) {
    console.error("Failed to generate static params for guru:", error);
    return fallback;
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
