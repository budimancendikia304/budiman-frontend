"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import ImageModal from "./ImageModal";
import { getImageUrl, IMAGE_PLACEHOLDER } from "@/lib/imageHelper";

interface ProgramFasilitas {
  id: number;
  nama: string;
  slug: string;
  deskripsi: string | null;
  ikon: string | null;
  url: string | null;
  unit: string;
}

export default function ProgramFasilitasList({ unit, onEdit }: { unit: "sd" | "smp", onEdit: (item: ProgramFasilitas) => void }) {
  const [items, setItems] = useState<ProgramFasilitas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const isAdmin = pathname.includes('/admin');
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      const response = await api.get(`/program-fasilitas?unit=${unit}`);
      setItems(response.data);
    } catch {
      toast.error("Gagal mengambil data Program & Fasilitas.");
    } finally {
      setIsLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return;
    try {
      await api.delete(`/program-fasilitas/${id}`);
      toast.success("Item berhasil dihapus.");
      setItems(prev => prev.filter(item => item.id !== id));
    } catch {
      toast.error("Gagal menghapus item.");
    }
  };

  if (isLoading) return (
    <div className="flex justify-center p-12">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tosca-500"></div>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col">
            <div 
              className="w-20 h-20 bg-tosca-50 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-sm overflow-hidden cursor-pointer"
              onClick={(e) => {
                try {
                  const container = e.currentTarget;
                  if (container) {
                    const img = container.querySelector("img");
                    if (img) {
                      const src = img.getAttribute("src");
                      if (src) {
                        setSelectedImage(src);
                        setSelectedTitle(item.nama || "");
                        return;
                      }
                    }
                  }
                  // Fallback jika elemen tidak ditemukan
                  setSelectedImage(getImageUrl(item.ikon));
                  setSelectedTitle(item.nama || "");
                } catch (err) {
                  console.error("Gagal membuka gambar program/fasilitas:", err);
                  setSelectedImage(getImageUrl(item.ikon));
                  setSelectedTitle(item.nama || "");
                }
              }}
            >
              <img 
                src={getImageUrl(item.ikon)} 
                alt={item.nama} 
                onError={(e) => {
                  e.currentTarget.src = IMAGE_PLACEHOLDER;
                }}
                className="w-full h-full object-cover" 
              />
            </div>
            
            <h3 className="text-xl font-black text-gray-900 mb-4 text-center uppercase tracking-tighter line-clamp-2">
              {item.nama}
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed text-center line-clamp-3 mb-6">
              {item.deskripsi}
            </p>
            
            {item.slug && (
              <div className="mb-6 text-center">
                <span className="text-[10px] font-black text-tosca-500 uppercase tracking-widest break-all px-4 py-1.5 bg-tosca-50 rounded-full">
                  Slug: {item.slug}
                </span>
              </div>
            )}

            {isAdmin && (
              <div className="mt-auto pt-6 border-t border-gray-50 flex justify-center gap-4">
                <button 
                  onClick={() => onEdit(item)} 
                  className="px-6 py-2 bg-tosca-50 text-tosca-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-tosca-500 hover:text-white transition-all"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">Belum ada Program & Fasilitas yang ditambahkan.</p>
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
