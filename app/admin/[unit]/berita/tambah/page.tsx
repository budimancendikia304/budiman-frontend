"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import BeritaForm from "@/components/BeritaForm";

export default function TambahBeritaPage() {
  const router = useRouter();
  const params = useParams();
  const unit = params.unit as "sd" | "smp";

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const savedUnit = localStorage.getItem("admin_unit");
    if (!token || savedUnit !== unit) {
      router.push(`/admin/login?unit=${unit}`);
    }
  }, [router, unit]);

  return (
    <AdminLayout unit={unit} title={`Tambah Berita ${unit.toUpperCase()}`}>
      <div className="max-w-4xl">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Buat Berita Baru</h2>
          <p className="text-gray-500 font-medium">Lengkapi formulir di bawah untuk menerbitkan berita baru ke unit {unit.toUpperCase()}.</p>
        </div>
        <BeritaForm unit={unit} />
      </div>
    </AdminLayout>
  );
}
