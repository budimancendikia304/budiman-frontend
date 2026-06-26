"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import ImageModal from "./ImageModal";
import Link from "next/link";
import { getImageUrl, IMAGE_PLACEHOLDER } from "@/lib/imageHelper";


interface Prestasi {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  image: string | null;
  kategori: string;
}

export default function PrestasiList({ unit }: { unit: "sd" | "smp" }) {
  const [prestasi, setPrestasi] = useState<Prestasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");

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

  const fetchPrestasi = useCallback(async () => {
    try {
      const response = await api.get(`/prestasi?unit=${unit}`);
      setPrestasi(response.data);
    } catch {
      toast.error("Gagal mengambil data prestasi.");
    } finally {
      setIsLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    fetchPrestasi();
  }, [fetchPrestasi]);

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (!confirm("Hapus data prestasi ini?")) return;
    const executeDelete = async () => {
      try {
        await api.delete(`/prestasi/${id}`);
        toast.success("Prestasi berhasil dihapus.");
        setPrestasi(prev => prev.filter(item => item.id !== id));
      } catch {
        toast.error("Gagal menghapus prestasi.");
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
        {prestasi.map((item) => (
          <div 
            key={item.id} 
            onClick={(e) => {
              try {
                const card = e.currentTarget;
                if (card) {
                  const img = card.querySelector("img");
                  if (img) {
                    const src = img.getAttribute("src");
                    if (src) {
                      setSelectedImage(src);
                      setSelectedTitle(item.judul || "");
                      return;
                    }
                  }
                }
                // Fallback jika elemen tidak ditemukan
                setSelectedImage(getImageUrl(item.image));
                setSelectedTitle(item.judul || "");
              } catch (err) {
                console.error("Gagal membuka gambar prestasi:", err);
                setSelectedImage(getImageUrl(item.image));
                setSelectedTitle(item.judul || "");
              }
            }}
            className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col cursor-pointer"
          >
            <div className="relative h-40 md:h-48 overflow-hidden bg-tosca-50 flex items-center justify-center">
              <img 
                src={getImageUrl(item.image)} 
                alt={item.judul} 
                onError={(e) => {
                  e.currentTarget.src = IMAGE_PLACEHOLDER;
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute top-3 left-3 md:top-4 md:left-4">
                <span className="px-2 py-0.5 md:px-3 md:py-1 bg-white/90 backdrop-blur text-tosca-700 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm flex items-center gap-1">
                  {item.kategori}
                </span>
              </div>
            </div>
            <div className="p-5 md:p-6 flex-1 flex flex-col">
              <h3 className="text-base md:text-lg font-black text-gray-800 mb-1 md:mb-2 leading-tight group-hover:text-tosca-700 transition-colors">{item.judul}</h3>
              <p className="text-gray-400 text-[10px] md:text-xs font-bold mb-3 md:mb-4 flex items-center gap-1">
                {new Date(item.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-gray-500 text-xs md:text-sm line-clamp-2 md:line-clamp-3 mb-4 md:mb-6 flex-1">{item.konten}</p>
              {isAdmin && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                  <Link onClick={(e) => e.stopPropagation()} href={`/admin/${unit}/prestasi/${item.id}/edit`} className="text-tosca-700 font-bold text-sm hover:underline flex items-center gap-1">Edit</Link>

                  <button onClick={(e) => handleDelete(e, item.id)} className="text-red-500 font-bold text-sm hover:underline flex items-center gap-1">Hapus</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {prestasi.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-300">
            <p className="text-gray-400 font-bold">Belum ada data prestasi tercatat.</p>
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
