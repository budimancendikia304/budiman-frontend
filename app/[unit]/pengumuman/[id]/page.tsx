"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-toastify";
import PublicLayout from "@/components/PublicLayout";
import { ChevronRight, User, Facebook, MessageCircle, Link2, Instagram, Calendar, Info, AlertCircle } from "lucide-react";

interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  image: string | null;
  is_aktif: boolean;
  created_at: string;
}

export default function PengumumanDetailPage() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";
  const id = params.id as string;

  const [announcement, setAnnouncement] = useState<Pengumuman | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnnouncementDetail = useCallback(async () => {
    try {
      const response = await api.get(`/pengumuman/${id}`);
      setAnnouncement(response.data);
    } catch {
      toast.error("Gagal mengambil data detail pengumuman.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchAnnouncementDetail();
    }
  }, [id, fetchAnnouncementDetail]);

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Tautan pengumuman berhasil disalin!"))
        .catch(() => toast.error("Gagal menyalin tautan."));
    }
  };

  const getFullDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <PublicLayout unit={unit}>
      <div className="pt-6 pb-24 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          
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
            <Link href={`/${unit}/pengumuman`} className="hover:text-tosca-700 transition-colors">
              Papan Pengumuman
            </Link>
            <ChevronRight size={12} className="text-tosca-200" />
            <span className="text-tosca-700">Detail</span>
          </nav>

          {/* Heading */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-tosca-900 tracking-tight mb-2 uppercase">
              Papan Pengumuman
            </h1>
            <div className="h-1.5 w-24 bg-tosca-500 rounded-full mt-4"></div>
          </div>

          {/* Main Content Card */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-tosca-500"></div>
            </div>
          ) : announcement ? (
            <div className="bg-white rounded-2xl border border-tosca-200 shadow-[0_4px_20px_rgba(11,107,105,0.03)] p-8 md:p-12 mb-10">
              
              {/* Badge & Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-tosca-200 flex-shrink-0">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-tosca-50 text-tosca-900 text-[10px] font-bold uppercase tracking-widest rounded-full border border-tosca-200">
                  <Info size={12} strokeWidth={1.5} className="text-tosca-900" />
                  INFORMASI PENTING
                </span>
                <div className="flex items-center gap-4 text-xs font-bold text-tosca-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} strokeWidth={1.5} className="text-tosca-500" />
                    {getFullDate(announcement.created_at)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <User size={14} strokeWidth={1.5} className="text-tosca-500" />
                    Hubungi Sekolah
                  </span>
                </div>
              </div>

              {/* Judul Utama */}
              <h2 className="text-2xl md:text-4xl font-black text-tosca-900 leading-tight mb-6">
                {announcement.judul}
              </h2>

              {/* Announcement Banner Image if exists */}
              {announcement.image && (
                <div className="mb-8 rounded-xl overflow-hidden max-h-[450px] shadow-sm border border-tosca-200">
                  <img src={announcement.image} alt={announcement.judul} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Content body (Tampilkan isi konten utama terlebih dahulu) */}
              <div className="text-tosca-700 leading-relaxed font-medium text-base md:text-lg whitespace-pre-wrap mb-10">
                {announcement.isi}
              </div>

              {/* Share section at the very bottom (after content) */}
              <div className="pt-6 border-t border-tosca-200 flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-tosca-500 uppercase tracking-widest">
                    BAGIKAN:
                  </span>
                  <div className="flex items-center gap-2">
                    {/* WhatsApp Button */}
                    <a 
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(announcement.judul + " " + (typeof window !== "undefined" ? window.location.href : ""))}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-tosca-50 hover:bg-tosca-900 text-tosca-900 hover:text-white flex items-center justify-center transition-colors duration-300 ease-in-out shadow-sm border border-tosca-200"
                      title="Bagikan ke WhatsApp"
                    >
                      <MessageCircle size={15} strokeWidth={1.5} />
                    </a>
                    {/* Instagram Button */}
                    <a 
                      href="https://www.instagram.com/sat_almanshurah/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-tosca-50 hover:bg-tosca-900 text-tosca-900 hover:text-white flex items-center justify-center transition-colors duration-300 ease-in-out shadow-sm border border-tosca-200"
                      title="Kunjungi Instagram Kami"
                    >
                      <Instagram size={15} strokeWidth={1.5} />
                    </a>
                    {/* Facebook Button */}
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-tosca-50 hover:bg-tosca-900 text-tosca-900 hover:text-white flex items-center justify-center transition-colors duration-300 ease-in-out shadow-sm border border-tosca-200"
                      title="Bagikan ke Facebook"
                    >
                      <Facebook size={15} strokeWidth={1.5} />
                    </a>
                    {/* Copy Link Button */}
                    <button 
                      onClick={copyToClipboard}
                      className="w-9 h-9 rounded-full bg-tosca-50 hover:bg-tosca-900 text-tosca-900 hover:text-white flex items-center justify-center transition-colors duration-300 ease-in-out shadow-sm border border-tosca-200"
                      title="Salin Tautan"
                    >
                      <Link2 size={15} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact section embedded right under the share section (Horizontal Layout) */}
              <div className="bg-white border border-tosca-200 p-8 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-6 shadow-[0_4px_20px_rgba(11,107,105,0.03)] mt-4">
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
          ) : (
            <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-tosca-200 p-8 shadow-sm">
              <AlertCircle size={48} strokeWidth={1.5} className="text-tosca-200 mx-auto mb-4" />
              <h3 className="text-lg font-black text-tosca-900 mb-1">Pengumuman Tidak Ditemukan</h3>
              <p className="text-tosca-700 font-bold text-sm">Maaf, detail pengumuman yang Anda cari tidak tersedia.</p>
              <Link href={`/${unit}/pengumuman`} className="mt-6 inline-block text-xs font-semibold text-tosca-500 hover:text-tosca-700 transition-colors uppercase tracking-wider">
                Kembali ke Papan Pengumuman
              </Link>
            </div>
          )}

        </div>
      </div>
    </PublicLayout>
  );
}
