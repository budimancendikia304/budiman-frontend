"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import PPDBList from "@/components/PPDBList";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PPDBPage() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const savedUnit = localStorage.getItem("admin_unit");
    if (token && savedUnit === unit) {
      setIsAdmin(true);
    }
  }, [unit]);

  return (
    <AdminLayout unit={unit} title={`PPDB Online ${unit.toUpperCase()}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Data Pendaftar</h2>
          <p className="text-gray-400 font-medium">Manajemen pendaftaran siswa baru unit {unit.toUpperCase()}.</p>
        </div>
      </div>
      <PPDBList unit={unit} />
    </AdminLayout>
  );
}
