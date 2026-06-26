"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import PrestasiForm from "@/components/PrestasiForm";
import api from "@/lib/api";
import { toast } from "react-toastify";

export default function EditPrestasiPage() {
  const router = useRouter();
  const params = useParams();
  const unit = params.unit as "sd" | "smp";
  const id = params.id as string;
  const [prestasi, setPrestasi] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const savedUnit = localStorage.getItem("admin_unit");
    if (!token || savedUnit !== unit) {
      router.push(`/admin/login?unit=${unit}`);
      return;
    }

    const fetchPrestasi = async () => {
      try {
        const res = await api.get(`/prestasi/${id}`);
        setPrestasi(res.data);
      } catch (err) {
        toast.error("Gagal memuat data prestasi.");
        router.push(`/admin/${unit}/prestasi`);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestasi();
  }, [router, unit, id]);

  return (
    <AdminLayout unit={unit} title={`Edit Prestasi ${unit.toUpperCase()}`}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Edit Data Prestasi</h2>
          <p className="text-gray-500 font-medium">Ubah informasi prestasi, kategori, tingkat, dan foto dokumentasi untuk unit {unit.toUpperCase()}.</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tosca-500"></div>
          </div>
        ) : (
          prestasi && <PrestasiForm unit={unit} initialData={prestasi} />
        )}
      </div>
    </AdminLayout>
  );
}
