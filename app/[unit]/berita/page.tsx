"use client";

import PublicLayout from "@/components/PublicLayout";
import BeritaList from "@/components/BeritaList";
import { useParams } from "next/navigation";

export default function PublicBeritaPage() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";

  return (
    <PublicLayout unit={unit}>
      <div className="pt-8 md:pt-16 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2 md:mb-4">Berita & Artikel</h1>
            <p className="text-gray-500 text-sm md:text-base font-medium italic">Informasi terkini dan liputan kegiatan unit {unit.toUpperCase()}.</p>
          </div>
          <BeritaList unit={unit} />
        </div>
      </div>
    </PublicLayout>
  );
}
