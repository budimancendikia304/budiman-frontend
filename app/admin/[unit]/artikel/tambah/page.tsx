"use client";

import DashboardLayout from "@/components/DashboardLayout";
import ArtikelForm from "@/components/ArtikelForm";
import { useParams } from "next/navigation";

export default function TambahArtikelPage() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";

  return (
    <DashboardLayout unit={unit} title={`Tambah Artikel Baru ${unit.toUpperCase()}`}>
      <div className="mb-10">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Buat Artikel Baru</h2>
        <p className="text-gray-400 font-medium">Lengkapi form di bawah untuk menerbitkan artikel baru.</p>
      </div>
      <ArtikelForm unit={unit} />
    </DashboardLayout>
  );
}
