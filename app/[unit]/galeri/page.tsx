"use client";

import PublicLayout from "@/components/PublicLayout";
import GaleriList from "@/components/GaleriList";
import { useParams } from "next/navigation";

export default function PublicGaleriPage() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";

  return (
    <PublicLayout unit={unit}>
      <div className="pt-16 pb-20 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Galeri Dokumentasi</h1>
            <p className="text-gray-500 font-medium italic">Koleksi momen dan kegiatan di unit {unit.toUpperCase()}.</p>
          </div>
          <GaleriList unit={unit} />
        </div>
      </div>
    </PublicLayout>
  );
}
