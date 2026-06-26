"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-toastify";
import PublicLayout from "@/components/PublicLayout";
import { ChevronRight, Maximize2, Image as ImageIcon } from "lucide-react";
import ShareableImageModal from "@/components/ShareableImageModal";
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

export default function FasilitasPage() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";

  const [items, setItems] = useState<ProgramFasilitas[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState("");
  const [activeDescription, setActiveDescription] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      const response = await api.get(`/program-fasilitas?unit=${unit}`);
      // Filter only items with images (ikon) to show in the photo masonry grid
      const itemsWithImages = response.data.filter((item: ProgramFasilitas) => item.ikon);
      setItems(itemsWithImages);
    } catch {
      toast.error("Gagal mengambil data fasilitas.");
    } finally {
      setIsLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <>
      <PublicLayout unit={unit}>
        <div className="pt-6 pb-24 bg-white min-h-screen">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tosca-500 mb-8">
              <Link href={`/${unit}`} className="hover:text-tosca-700 transition-colors">
                Beranda
              </Link>
              <ChevronRight size={12} className="text-tosca-200" />
              <Link href="#" className="hover:text-tosca-700 transition-colors">
                Profil Sekolah
              </Link>
              <ChevronRight size={12} className="text-tosca-200" />
              <span className="text-tosca-700">Fasilitas Sekolah</span>
            </nav>

            {/* Heading */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-tosca-900 tracking-tight mb-2 uppercase">
                Fasilitas Sekolah
              </h1>
              <div className="h-1.5 w-24 bg-tosca-500 rounded-full mt-4"></div>
            </div>

            {/* Main Content */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-tosca-500"></div>
              </div>
            ) : (
              <>
                {items.length > 0 ? (
                  <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/${unit}/program/${item.slug}`}
                        className="block break-inside-avoid bg-white/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-[0_8px_32px_0_rgba(11,107,105,0.08)] hover:shadow-[0_15px_35px_rgba(11,107,105,0.15)] hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer group mb-6 relative"
                      >
                        {/* Image block */}
                        <div className="relative overflow-hidden w-full h-auto">
                          <img 
                            src={getImageUrl(item.ikon)} 
                            alt={item.nama}
                            onError={(e) => {
                              e.currentTarget.src = IMAGE_PLACEHOLDER;
                            }}
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          
                          {/* Lightbox Trigger Button (Shows on hover) */}
                          <div 
                            className="absolute top-4 right-4 bg-[#0B6B69]/70 hover:bg-[#0B6B69] backdrop-blur-md p-2.5 rounded-full text-white transition-all duration-300 opacity-0 group-hover:opacity-100 z-20 border border-white/10 shadow-lg"
                            onClick={(e) => {
                              try {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveImage(getImageUrl(item.ikon));
                                setActiveTitle(item.nama);
                                setActiveDescription(item.deskripsi || "");
                                setIsLightboxOpen(true);
                              } catch (err) {
                                console.error("Gagal membuka lightbox:", err);
                              }
                            }}
                          >
                            <Maximize2 size={15} strokeWidth={2.5} />
                          </div>

                          {/* Hover Overlay with glassmorphism (Slides up on hover) */}
                          <div className="absolute bottom-0 left-0 right-0 bg-[#0B6B69]/75 backdrop-blur-md border-t border-white/15 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex flex-col justify-end select-none z-10">
                            <h3 className="text-white text-base md:text-lg font-black uppercase tracking-tight mb-1.5">
                              {item.nama}
                            </h3>
                            {item.deskripsi && (
                              <p className="text-tosca-50 text-xs font-bold leading-relaxed line-clamp-3">
                                {item.deskripsi}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-tosca-200 p-8 shadow-sm">
                    <ImageIcon size={48} strokeWidth={1.5} className="text-tosca-200 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-tosca-900 mb-1">Fasilitas Belum Tersedia</h3>
                    <p className="text-tosca-700 font-bold text-sm">Dokumentasi fasilitas sekolah belum ditambahkan saat ini.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </PublicLayout>

      {/* Fullscreen Lightbox Modal */}
      <ShareableImageModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageUrl={activeImage || ""}
        title={activeTitle}
        description={activeDescription}
      />
    </>
  );
}
