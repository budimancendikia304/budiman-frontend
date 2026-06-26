"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import Link from "next/link";


interface Guru {
  id: number;
  nama: string;
  jabatan: string;
  mata_pelajaran: string | null;
  foto: string | null;
}

export default function GuruList({ unit }: { unit: "sd" | "smp" }) {
  const [guru, setGuru] = useState<Guru[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchGuru = useCallback(async () => {
    try {
      const response = await api.get(`/guru?unit=${unit}`);
      setGuru(response.data);
    } catch {
      toast.error("Gagal mengambil data guru.");
    } finally {
      setIsLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    fetchGuru();
  }, [fetchGuru]);

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (!confirm("Hapus data guru ini?")) return;
    const executeDelete = async () => {
      try {
        await api.delete(`/guru/${id}`);
        toast.success("Data guru berhasil dihapus.");
        setGuru(prev => prev.filter(item => item.id !== id));
      } catch {
        toast.error("Gagal menghapus data.");
      }
    };
    executeDelete();
  };

  if (isLoading) return (
    <div className="flex justify-center p-12">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tosca-500"></div>
    </div>
  );

  return (
    <div className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest">Nama</th>
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest">Jabatan</th>
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest">Mapel</th>
              {isAdmin && <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {guru.map((item) => (
              <tr key={item.id} className="hover:bg-tosca-50/30 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-tosca-50 flex-shrink-0 shadow-sm border border-gray-100 flex items-center justify-center">
                       {item.foto ? (
                         <img src={item.foto} alt={item.nama} className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-tosca-500 font-black text-xs">{item.nama.charAt(0).toUpperCase()}</span>
                       )}
                    </div>
                    <p className="text-gray-800 font-bold group-hover:text-tosca-700 transition-colors">{item.nama}</p>
                  </div>
                </td>
                <td className="px-8 py-5 text-gray-500 font-medium">{item.jabatan}</td>
                <td className="px-8 py-5 text-gray-500 font-medium">{item.mata_pelajaran || '-'}</td>
                {isAdmin && (
                  <td className="px-8 py-5 text-right space-x-3">
                    <Link href={`/admin/${unit}/guru/${item.id}/edit`} className="text-tosca-700 hover:text-tosca-900 font-bold text-sm inline-flex items-center gap-1">
                      Edit
                    </Link>

                    <button onClick={(e) => handleDelete(e, item.id)} className="text-red-500 hover:text-red-700 font-bold text-sm inline-flex items-center gap-1">
                      Hapus
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
