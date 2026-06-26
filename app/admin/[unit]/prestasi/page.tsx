"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import PrestasiList from "@/components/PrestasiList";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Trophy } from "lucide-react";

export default function PrestasiPage() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem("admin_token");
      const savedUnit = localStorage.getItem("admin_unit");
      if (token && savedUnit === unit) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, [unit]);

  return (
    <AdminLayout unit={unit} title={`Prestasi ${unit.toUpperCase()}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Daftar Prestasi</h2>
          <p className="text-gray-400 font-medium">Catatan prestasi siswa, guru, and sekolah unit {unit.toUpperCase()}.</p>
        </div>
        {isAdmin && (
          <Link href={`/admin/${unit}/prestasi/tambah`} className="bg-tosca-500 hover:bg-tosca-700 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-lg shadow-tosca-500/20 flex items-center gap-3 hover:-translate-y-1">
            <Trophy size={18} /> Tambah Prestasi
          </Link>
        )}
      </div>
      <PrestasiList unit={unit} />
    </AdminLayout>
  );
}
