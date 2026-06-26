"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { Megaphone, Calendar } from "lucide-react";

interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  image: string | null;
  is_aktif: boolean;
  created_at: string;
}

export default function PengumumanList({ unit }: { unit: "sd" | "smp" }) {
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
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

  const fetchPengumuman = useCallback(async () => {
    try {
      const response = await api.get(`/pengumuman?unit=${unit}`);
      setPengumuman(response.data);
    } catch {
      toast.error("Gagal mengambil data pengumuman.");
    } finally {
      setIsLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    fetchPengumuman();
  }, [fetchPengumuman]);

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (!confirm("Hapus pengumuman ini?")) return;
    const executeDelete = async () => {
      try {
        await api.delete(`/pengumuman/${id}`);
        toast.success("Pengumuman berhasil dihapus.");
        setPengumuman(prev => prev.filter(item => item.id !== id));
      } catch {
        toast.error("Gagal menghapus pengumuman.");
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
    <div className="space-y-6">
      {pengumuman.map((item) => (
        <div key={item.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-md transition group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-tosca-500"></div>
          <div className="flex flex-col md:flex-row gap-8">
            {item.image && (
              <div className="w-full md:w-48 h-48 rounded-[32px] overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
                <img src={item.image} alt={item.judul} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-tosca-50 text-tosca-700 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                      <Megaphone size={12} />
                      INFO RESMI
                    </span>
                    <span className="text-gray-400 text-[10px] md:text-xs font-bold flex items-center gap-2">
                      <Calendar size={12} />
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-800 tracking-tight">{item.judul}</h3>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button className="text-tosca-700 hover:bg-tosca-50 p-2 rounded-xl transition text-sm font-bold">Edit</button>
                    <button onClick={(e) => handleDelete(e, item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition text-sm font-bold">Hapus</button>
                  </div>
                )}
              </div>
              <p className="text-gray-500 leading-relaxed font-medium">{item.isi}</p>
            </div>
          </div>
        </div>
      ))}
      {pengumuman.length === 0 && (
        <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-300">
          <p className="text-gray-400 font-bold">Belum ada pengumuman aktif.</p>
        </div>
      )}
    </div>
  );
}
