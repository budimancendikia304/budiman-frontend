"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-toastify";
import PublicLayout from "@/components/PublicLayout";
import { ChevronRight, Calendar, User, Share2, Facebook, Instagram, MessageCircle, Link2, Info, Megaphone } from "lucide-react";

interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  image: string | null;
  is_aktif: boolean;
  created_at: string;
}

export default function PublicPengumumanPage() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";

  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPengumuman = useCallback(async () => {
    try {
      const response = await api.get(`/pengumuman?unit=${unit}`);
      // Only show active announcements
      const activeAnnouncements = response.data.filter((item: Pengumuman) => item.is_aktif !== false);
      setPengumuman(activeAnnouncements);
    } catch {
      toast.error("Gagal mengambil data pengumuman.");
    } finally {
      setIsLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    fetchPengumuman();
  }, [fetchPengumuman]);

  const getFullDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <PublicLayout unit={unit}>
      <div className="pt-6 pb-24 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          
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
            <span className="text-tosca-700">Papan Pengumuman</span>
          </nav>

          {/* Heading */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-tosca-900 tracking-tight mb-2 uppercase">
              Papan Pengumuman
            </h1>
            <div className="h-1.5 w-24 bg-tosca-500 rounded-full mt-4"></div>
          </div>

          {/* Main Card List */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-tosca-500"></div>
            </div>
          ) : (
            <>
              {pengumuman.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pengumuman.map((item) => (
                    <div 
                      key={item.id} 
                      id={`announcement-${item.id}`}
                      className="bg-white rounded-2xl border border-tosca-200 shadow-[0_4px_20px_rgba(11,107,105,0.03)] hover:shadow-[0_10px_20px_rgba(11,107,105,0.12)] hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden group scroll-mt-28"
                    >
                      {/* Top Header of Card */}
                      <div className="p-8 pb-0 flex justify-between items-center flex-shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-tosca-50 text-tosca-900 text-[10px] font-bold uppercase tracking-widest rounded-full border border-tosca-200">
                          <Info size={12} strokeWidth={1.5} className="text-tosca-900" />
                          PENTING
                        </span>
                        <span className="text-[10px] font-bold text-tosca-500 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar size={13} strokeWidth={1.5} className="text-tosca-500" />
                          {getFullDate(item.created_at)}
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="p-8 pt-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-[19px] font-black text-tosca-900 leading-snug mb-3 group-hover:text-tosca-700 transition-colors line-clamp-2">
                            {item.judul}
                          </h3>
                          <p className="text-tosca-700 text-sm leading-relaxed mb-8 line-clamp-4 whitespace-pre-wrap font-medium flex-1">
                            {item.isi}
                          </p>
                        </div>

                        {/* Read More Button (Solid Tosca Palette) */}
                        <Link 
                          href={`/${unit}/pengumuman/${item.id}`}
                          className="w-full inline-flex items-center justify-center py-3.5 px-5 bg-tosca-500 hover:bg-tosca-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors duration-300 ease-in-out shadow-sm shadow-tosca-500/10 active:scale-95"
                        >
                          BACA SELENGKAPNYA
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-tosca-200 p-8 shadow-sm">
                  <Megaphone size={48} strokeWidth={1.5} className="text-tosca-200 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-tosca-900 mb-1">Tidak Ada Pengumuman</h3>
                  <p className="text-tosca-700 font-bold text-sm">Belum ada pengumuman aktif saat ini.</p>
                </div>
              )}
            </>
          )}

          {/* Contact school administration section (Horizontal Layout) */}
          <div className="mt-16 bg-white border border-tosca-200 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_4px_20px_rgba(11,107,105,0.03)] max-w-4xl mx-auto flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 bg-tosca-50 text-tosca-700 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle size={22} strokeWidth={1.5} className="text-tosca-700" />
              </div>
              <div>
                <h3 className="text-lg font-black text-tosca-900 leading-tight">
                  Butuh informasi lebih detail?
                </h3>
                <p className="text-tosca-700 text-xs mt-1.5 font-medium">
                  Silakan hubungi pihak sekolah kami untuk penjelasan resmi lebih lanjut.
                </p>
              </div>
            </div>
            <a 
              href="https://wa.me/6281534648183?text=Halo%20Admin%2C%20saya%20ingin%20bertanya%20mengenai%20info%20sekolah." 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-tosca-500 hover:bg-tosca-900 text-white font-bold rounded-xl transition-colors duration-300 ease-in-out uppercase tracking-wider text-xs flex-shrink-0"
            >
              Hubungi Sekolah
            </a>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
