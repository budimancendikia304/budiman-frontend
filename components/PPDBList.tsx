"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";

interface Ppdb {
  id: number;
  nama_lengkap: string;
  nisn: string;
  asal_sekolah: string;
  nama_ortu: string;
  no_hp: string;
  status: "pending" | "diterima" | "ditolak";
  created_at: string;
}

export default function PPDBList({ unit }: { unit: "sd" | "smp" }) {
  const [data, setData] = useState<Ppdb[]>([]);
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

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get(`/ppdb?unit=${unit}`);
      setData(response.data.data);
    } catch {
      toast.error("Gagal mengambil data PPDB.");
    } finally {
      setIsLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateStatus = async (id: number, status: string) => {
    if (!isAdmin) return;
    try {
      await api.patch(`/ppdb/${id}/status`, { status });
      toast.success(`Status berhasil diubah menjadi ${status}.`);
      fetchData();
    } catch {
      toast.error("Gagal mengubah status.");
    }
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
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest">Pendaftar</th>
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest">Asal Sekolah</th>
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest">Kontak</th>
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest">Status</th>
              {isAdmin && <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-tosca-50/30 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-tosca-100 rounded-xl flex items-center justify-center text-tosca-700 font-black text-sm uppercase">
                        {item.nama_lengkap.substring(0, 2)}
                     </div>
                     <div>
                        <p className="text-gray-800 font-bold mb-0.5">{item.nama_lengkap}</p>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">NISN: {item.nisn || '-'}</p>
                     </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="text-gray-600 font-medium">{item.asal_sekolah}</p>
                </td>
                <td className="px-8 py-5">
                  <p className="text-gray-800 font-bold text-sm">{item.no_hp}</p>
                  <p className="text-gray-400 text-xs font-medium">{item.nama_ortu} (Ortu)</p>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    item.status === 'diterima' ? 'bg-green-100 text-green-700' : 
                    item.status === 'ditolak' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => updateStatus(item.id, 'diterima')} className="px-3 py-1 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20 hover:scale-110 transition-transform text-[10px] font-black uppercase">Terima</button>
                      <button onClick={() => updateStatus(item.id, 'ditolak')} className="px-3 py-1 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 hover:scale-110 transition-transform text-[10px] font-black uppercase">Tolak</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <p className="text-gray-400 font-bold">Belum ada data pendaftar PPDB.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
