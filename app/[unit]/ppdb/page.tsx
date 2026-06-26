"use client";

import PublicLayout from "@/components/PublicLayout";
import PPDBForm from "@/components/PPDBForm";
import { useParams } from "next/navigation";

export default function PublicPPDBPage() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";

  return (
    <PublicLayout unit={unit}>
      <div className="pt-16 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">PPDB Online</h1>
            <p className="text-gray-500 font-medium italic">Pendaftaran siswa baru unit {unit.toUpperCase()} tahun ajaran 2026/2027.</p>
          </div>
          <PPDBForm unit={unit} />
        </div>
      </div>
    </PublicLayout>
  );
}
