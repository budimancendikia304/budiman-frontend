"use client";

import AdminLayout from "@/components/AdminLayout";
import PPDBForm from "@/components/PPDBForm";
import { useParams } from "next/navigation";

export default function DaftarPPDBPage() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";

  return (
    <AdminLayout unit={unit} title="Pendaftaran Siswa Baru">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Formulir PPDB Online</h2>
          <p className="text-lg text-gray-500 font-medium">Lengkapi data di bawah ini untuk mendaftarkan calon siswa ke unit {unit.toUpperCase()}.</p>
        </div>
        <PPDBForm unit={unit} />
      </div>
    </AdminLayout>
  );
}
