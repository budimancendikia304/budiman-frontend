"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import GuruForm from "@/components/GuruForm";

export default function TambahGuruPage() {
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
    <AdminLayout unit={unit} title={`Tambah Guru ${unit.toUpperCase()}`}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Pendaftaran Guru Baru</h2>
          <p className="text-gray-500 font-medium">Lengkapi data diri dan foto pengajar untuk unit {unit.toUpperCase()}.</p>
        </div>
        <GuruForm unit={unit} />
      </div>
    </AdminLayout>
  );
}
