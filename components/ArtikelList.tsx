"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import ImageModal from "./ImageModal";

interface Artikel {
  id: number;
  judul: string;
  tanggal: string | null;
  kategori: string;
  thumbnail: string | null;
  is_published: boolean;
}

export default function ArtikelList({ unit }: { unit: "sd" | "smp" }) {
  const pathname = usePathname();
  const isDashboard = pathname.includes('/admin');
  
  const [artikel, setArtikel] = useState<Artikel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("admin_token");
    const savedUnit = localStorage.getItem("admin_unit");
    if (isDashboard && token && savedUnit === unit) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [unit, isDashboard]);

  const fetchArtikel = useCallback(async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const savedUnit = localStorage.getItem("admin_unit");
      const isActuallyAdmin = isDashboard && token && savedUnit === unit;
      
      const response = await api.get(`/artikel?unit=${unit}${isActuallyAdmin ? '&show_all=1' : ''}`);
      setArtikel(response.data.data);
    } catch {
      toast.error("Gagal mengambil data artikel.");
    } finally {
      setIsLoading(false);
    }
  }, [unit, isDashboard]);

  useEffect(() => {
    fetchArtikel();
  }, [fetchArtikel]);

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;
    const executeDelete = async () => {
      try {
        await api.delete(`/artikel/${id}`);
        toast.success("Artikel berhasil dihapus.");
        setArtikel(prevArtikel => prevArtikel.filter(item => item.id !== id));
      } catch {
        toast.error("Gagal menghapus artikel.");
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {artikel.map((item) => (
          <div key={item.id} className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col">
            <div 
              className={`relative h-48 md:h-52 overflow-hidden bg-tosca-50 flex items-center justify-center ${item.thumbnail ? 'cursor-pointer' : ''}`}
              onClick={() => {
                if (item.thumbnail) {
                  setSelectedImage(item.thumbnail);
                  setSelectedTitle(item.judul || "");
                }
              }}
            >
              {item.thumbnail ? (
                <img src={item.thumbnail} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                   <div className="w-12 h-12 rounded-2xl bg-tosca-100 flex items-center justify-center text-tosca-500 font-black text-xl">
                      {unit.toUpperCase()}
                   </div>
                   <span className="text-[10px] text-tosca-300 font-black uppercase tracking-widest">Artikel</span>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur text-tosca-700 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                  {item.kategori}
                </span>
              </div>
              {isMounted && isAdmin && (
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${item.is_published ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                    {item.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-4 md:p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'Tanpa Tanggal'}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-black text-gray-800 mb-3 md:mb-4 line-clamp-2 leading-tight group-hover:text-tosca-700 transition-colors">
                {item.judul}
              </h3>
              
              {isMounted && isAdmin && (
                <div className="mt-auto pt-6 border-t border-gray-50 flex justify-end gap-3">
                  <button onClick={(e) => handleDelete(e, item.id)} className="text-red-500 hover:text-red-700 font-bold text-sm">
                    Hapus
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {artikel.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">Belum ada artikel yang diterbitkan.</p>
          </div>
        )}
      </div>

      <ImageModal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        imageUrl={selectedImage || ""} 
        title={selectedTitle}
      />
    </>
  );
}
