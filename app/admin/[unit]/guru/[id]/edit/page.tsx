"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import GuruForm from "@/components/GuruForm";
import api from "@/lib/api";
import { toast } from "react-toastify";

export default function EditGuruPage() {
  const router = useRouter();
  const params = useParams();
  const unit = params.unit as "sd" | "smp";
  const id = params.id as string;
  const [guru, setGuru] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const savedUnit = localStorage.getItem("admin_unit");
    if (!token || savedUnit !== unit) {
      router.push(`/admin/login?unit=${unit}`);
      return;
    }

    const fetchGuru = async () => {
      try {
        const res = await api.get(`/guru/${id}`);
        setGuru(res.data);
      } catch (err) {
        toast.error("Gagal memuat data guru.");
        router.push(`/admin/${unit}/guru`);
      } finally {
        setLoading(false);
      }
    };

    fetchGuru();
  }, [router, unit, id]);

  return (
    <AdminLayout unit={unit} title={`Edit Guru ${unit.toUpperCase()}`}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Edit Data Guru</h2>
          <p className="text-gray-500 font-medium">Ubah informasi data diri dan foto pengajar untuk unit {unit.toUpperCase()}.</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tosca-500"></div>
          </div>
        ) : (
          guru && <GuruForm unit={unit} initialData={guru} />
        )}
      </div>
    </AdminLayout>
  );
}
