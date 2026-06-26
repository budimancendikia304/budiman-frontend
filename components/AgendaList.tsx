"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import { MapPin } from "lucide-react";
import Link from "next/link";

import ImageModal from "./ImageModal";

interface Agenda {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  lokasi: string | null;
  image: string | null;
}

export default function AgendaList({ unit }: { unit: "sd" | "smp" }) {
  const pathname = usePathname();
  const isDashboard = pathname.includes('/admin');
  
  const [agenda, setAgenda] = useState<Agenda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const checkAdmin = () => {
      const token = localStorage.getItem("admin_token");
      const savedUnit = localStorage.getItem("admin_unit");
      if (isDashboard && token && savedUnit === unit) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, [unit, isDashboard]);

  const fetchAgenda = useCallback(async () => {
    try {
      const response = await api.get(`/agenda?unit=${unit}`);
      setAgenda(response.data);
    } catch {
      toast.error("Gagal mengambil data agenda.");
    } finally {
      setIsLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    fetchAgenda();
  }, [fetchAgenda]);

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (!confirm("Hapus agenda ini?")) return;
    const executeDelete = async () => {
      try {
        await api.delete(`/agenda/${id}`);
        toast.success("Agenda berhasil dihapus.");
        setAgenda(prev => prev.filter(item => item.id !== id));
      } catch {
        toast.error("Gagal menghapus agenda.");
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agenda.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedAgenda(item)}
            className="bg-white p-6 rounded-[24px] md:rounded-[32px] shadow-sm border border-gray-100 flex gap-6 hover:shadow-md transition-all group relative items-center cursor-pointer"
          >
            {/* Date Block */}
            <div className="flex-shrink-0">
              <div className="w-20 h-24 bg-[#0FA8A4] rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-[#0FA8A4]/20 transition-transform group-hover:scale-105 duration-300">
                <span className="text-[11px] font-black text-white/80 uppercase tracking-widest">
                  {new Date(item.tanggal).toLocaleDateString('id-ID', { month: 'short' })}
                </span>
                <span className="text-3xl font-black text-white">
                  {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Content Block */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-[#0FA8A4] text-[10px] font-black uppercase tracking-widest mb-1">
                 <MapPin size={12} />
                 {item.lokasi || 'Sekolah'}
              </div>
              <h3 className="text-lg font-black text-gray-800 mb-2 leading-tight group-hover:text-[#0FA8A4] transition-colors">
                {item.judul}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-1 leading-relaxed font-medium mb-4">
                {item.konten}
              </p>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#0FA8A4] flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                Lihat Detail <span>→</span>
              </div>
            </div>

            {isMounted && isAdmin && (
              <div className="absolute top-4 right-4 flex gap-1 opacity-100 transition-opacity z-10">
                <Link onClick={(e) => e.stopPropagation()} href={`/admin/${unit}/agenda/${item.id}/edit`} className="px-3 py-1 bg-white border border-gray-100 text-tosca-700 hover:bg-tosca-50 rounded-xl text-xs font-bold shadow-sm">Edit</Link>

                <button onClick={(e) => handleDelete(e, item.id)} className="px-3 py-1 bg-white border border-gray-100 text-red-500 hover:bg-red-50 rounded-xl text-xs font-bold shadow-sm">Hapus</button>
              </div>
            )}
          </div>
        ))}
        {agenda.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-300">
            <p className="text-gray-400 font-bold">Belum ada agenda mendatang.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedAgenda && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedAgenda(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-zoom-in">
            <div className="bg-[#0FA8A4] p-8 text-white">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20 flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest">{new Date(selectedAgenda.tanggal).toLocaleDateString('id-ID', { month: 'short' })}</span>
                    <span className="text-2xl font-black">{new Date(selectedAgenda.tanggal).toLocaleDateString('id-ID', { day: '2-digit' })}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Agenda Event</span>
                    <h2 className="text-2xl font-black leading-tight uppercase">{selectedAgenda.judul}</h2>
                  </div>
                </div>
                <button onClick={() => setSelectedAgenda(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest opacity-90 uppercase">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {selectedAgenda.lokasi || 'Gedung Budiman Cendikia'}
              </div>
            </div>
            <div className="p-10">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Deskripsi Kegiatan</h4>
              <div className="text-gray-600 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                {selectedAgenda.konten}
              </div>
              <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setSelectedAgenda(null)}
                  className="px-10 py-4 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
