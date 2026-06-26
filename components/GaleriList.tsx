"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import ImageModal from "./ImageModal";
import { getImageUrl, IMAGE_PLACEHOLDER } from "@/lib/imageHelper";
import Link from "next/link";

interface Galeri {
  id: number;
  judul: string;
  image: string;
  deskripsi: string | null;
}

export default function GaleriList({ unit }: { unit: "sd" | "smp" }) {
  const pathname = usePathname();
  const isDashboard = pathname.includes('/admin');
  
  const [galeri, setGaleri] = useState<Galeri[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    setIsMounted(true);
    const checkAdmin = () => {
      const token = localStorage.getItem("admin_token");
      const savedUnit = localStorage.getItem("admin_unit");
      // Hanya aktifkan mode admin jika di rute admin DAN token valid
      if (isDashboard && token && savedUnit === unit) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, [unit, isDashboard]);

  const fetchGaleri = useCallback(async () => {
    try {
      const response = await api.get(`/galeri?unit=${unit}`);
      setGaleri(response.data);
    } catch {
      toast.error("Gagal mengambil data galeri.");
    } finally {
      setIsLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    fetchGaleri();
  }, [fetchGaleri]);

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (!confirm("Hapus foto dari galeri?")) return;
    const executeDelete = async () => {
      try {
        await api.delete(`/galeri/${id}`);
        toast.success("Foto berhasil dihapus.");
        setGaleri(prev => prev.filter(item => item.id !== id));
      } catch {
        toast.error("Gagal menghapus foto.");
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
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 [column-fill:_balance] px-2">
        {galeri.map((item) => (
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
                console.error("Gagal membuka gambar galeri:", err);
                setSelectedImage(getImageUrl(item.image));
                setSelectedTitle(item.judul || "");
              }
            }}
            className="break-inside-avoid mb-6 relative rounded-2xl overflow-hidden shadow-md group border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300"
          >
            <img 
              src={getImageUrl(item.image)} 
              alt={item.judul}
              onError={(e) => {
                e.currentTarget.src = IMAGE_PLACEHOLDER;
              }}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Dark Overlay with Title and Description */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left">
              <h3 className="text-white text-xs font-black uppercase tracking-wide translate-y-2 group-hover:translate-y-0 transition-transform duration-300 leading-tight">
                {item.judul}
              </h3>
              {item.deskripsi && (
                <p className="text-gray-300 text-[10px] font-medium mt-1 line-clamp-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75 leading-relaxed">
                  {item.deskripsi}
                </p>
              )}
            </div>

            {/* Admin actions */}
            {isMounted && isAdmin && (
              <div className="absolute top-3 right-3 flex gap-2 opacity-100 z-20">
                <Link 
                  href={`/admin/${unit}/galeri/${item.id}/edit`}
                  onClick={(e) => { e.stopPropagation(); }} 
                  className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-tosca-700 shadow-lg hover:bg-white transition-all text-[10px] font-black uppercase tracking-widest inline-block"
                >
                  Edit
                </Link>
                <button 
                  onClick={(e) => handleDelete(e, item.id)} 
                  className="bg-red-500/90 text-white px-3 py-1.5 rounded-xl shadow-lg hover:bg-red-600 transition-all text-[10px] font-black uppercase tracking-widest"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>
        ))}
        {galeri.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">Galeri masih kosong.</p>
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
