export function generateStaticParams() {
  return [
    { unit: "sd", slug: "sains-lab" },
    { unit: "sd", slug: "tahfidz-quran" },
    { unit: "sd", slug: "digital-program" },
    { unit: "smp", slug: "sains-lab" },
    { unit: "smp", slug: "tahfidz-quran" },
    { unit: "smp", slug: "digital-program" },
    { unit: "sd", slug: "default" },
    { unit: "smp", slug: "default" }
  ];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
