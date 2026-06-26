"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PublicLayout from "@/components/PublicLayout";
import { ChevronRight, ChevronLeft, Share2, Mail, MessageCircle, Link2, Facebook, Twitter, Beaker, BookOpen, Cpu, FileText } from "lucide-react";
import { toast } from "react-toastify";
import ShareableImageModal from "@/components/ShareableImageModal";

interface Ekstrakurikuler {
  id: number;
  nama: string;
  deskripsi: string;
  jadwal: string;
  image: string;
  is_aktif: boolean;
  slug?: string;
  daftarKegiatan?: string[] | string;
  galeri?: string[];
}

const DEFAULT_EKSKUL = [
  {
    id: 1,
    nama: "Sains Lab",
    deskripsi: "Eksplorasi eksperimen ilmiah seru, mengasah logika, dan menumbuhkan kecintaan terhadap ilmu pengetahuan alam.",
    jadwal: "Rabu, 14.00 - 15.30",
    image: "",
    is_aktif: true,
    slug: "sains-lab",
    daftarKegiatan: [
      "Praktikum Fisika Sederhana",
      "Eksperimen Kimia Menyenangkan (Non-Hazardous)",
      "Observasi Biologi dan Lingkungan Sekolah",
      "Penyusunan Proyek Karya Ilmiah Remaja (KIR)"
    ],
    galeri: [
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 2,
    nama: "Tahfidz Qur'an",
    deskripsi: "Program bimbingan menghafal Al-Qur'an secara tartil, menanamkan nilai luhur islam, dan membentuk karakter mulia.",
    jadwal: "Kamis, 14.00 - 15.30",
    image: "",
    is_aktif: true,
    slug: "tahfidz-quran",
    daftarKegiatan: [
      "Setoran Hafalan (Talaqqi & Ziyadah)",
      "Muroja'ah Bersama (Pengulangan Hafalan)",
      "Kajian Tajwid dan Makhorijul Huruf",
      "Pembiasaan Adab Harian Islami"
    ],
    galeri: [
      "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1609599006353-e629ffabfeae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 3,
    nama: "Digital Program",
    deskripsi: "Pengenalan dasar teknologi, pemrograman visual (scratch), robotika sederhana, dan literasi digital masa depan.",
    jadwal: "Jumat, 14.00 - 15.30",
    image: "",
    is_aktif: true,
    slug: "digital-program",
    daftarKegiatan: [
      "Pemrograman Dasar menggunakan Scratch",
      "Dasar Pembuatan Game dan Animasi Sederhana",
      "Pengenalan Komponen Robotika & Mikrokontroler",
      "Literasi Digital dan Etika Media Sosial"
    ],
    galeri: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
    ]
  }
];

const getEkskulIcon = (name: string) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("sains") || lowercaseName.includes("science") || lowercaseName.includes("lab")) {
    return <Beaker size={48} />;
  }
  if (lowercaseName.includes("tahfidz") || lowercaseName.includes("qur'an") || lowercaseName.includes("agama") || lowercaseName.includes("islam")) {
    return <BookOpen size={48} />;
  }
  if (lowercaseName.includes("digital") || lowercaseName.includes("program") || lowercaseName.includes("coding") || lowercaseName.includes("computer") || lowercaseName.includes("it")) {
    return <Cpu size={48} />;
  }
  return <FileText size={48} />;
};

export default function EkstrakurikulerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const unit = params.unit as "sd" | "smp";
  const slugParam = params.slug as string;

  const [item, setItem] = useState<Ekstrakurikuler | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePrevImage = () => {
    if (item && item.galeri && item.galeri.length > 0) {
      setSelectedImageIndex((prev) => 
        prev !== null ? (prev - 1 + item.galeri!.length) % item.galeri!.length : null
      );
    }
  };

  const handleNextImage = () => {
    if (item && item.galeri && item.galeri.length > 0) {
      setSelectedImageIndex((prev) => 
        prev !== null ? (prev + 1) % item.galeri!.length : null
      );
    }
  };

  useEffect(() => {
    try {
      const storageKey = `ekstrakurikuler_${unit}`;
      const savedData = localStorage.getItem(storageKey);
      const items: Ekstrakurikuler[] = savedData ? JSON.parse(savedData) : DEFAULT_EKSKUL;
      
      const found = items.find(
        (i) => i.slug === slugParam || i.id.toString() === slugParam
      );

      if (found && found.is_aktif) {
        setItem(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [unit, slugParam]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success("Link berhasil disalin ke clipboard!");
      }).catch(() => {
        toast.error("Gagal menyalin link.");
      });
    }
  };

  const shareText = item ? `Lihat kegiatan Ekstrakurikuler "${item.nama}" di Budiman Cendikia!` : "";

  if (isLoading) {
    return (
      <PublicLayout unit={unit}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-tosca-500"></div>
        </div>
      </PublicLayout>
    );
  }

  if (!item) {
    return (
      <PublicLayout unit={unit}>
        <div className="py-20 text-center bg-white min-h-screen flex flex-col justify-center items-center px-6">
          <h2 className="text-3xl font-black text-tosca-900 mb-2">Halaman Tidak Ditemukan</h2>
          <p className="text-gray-500 font-medium mb-8">Ekstrakurikuler yang Anda cari tidak tersedia atau dinonaktifkan.</p>
          <button 
            onClick={() => router.push(`/${unit}/ekstrakurikuler`)} 
            className="px-8 py-3 bg-tosca-500 hover:bg-tosca-600 text-white font-black rounded-xl transition-colors shadow-lg shadow-tosca-500/10"
          >
            Kembali ke Daftar
          </button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout unit={unit}>
      <div className="pt-6 pb-24 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tosca-500 mb-8">
            <Link href={`/${unit}`} className="hover:text-tosca-700 transition-colors">
              Beranda
            </Link>
            <ChevronRight size={12} className="text-tosca-200" />
            <Link href={`/${unit}/ekstrakurikuler`} className="hover:text-tosca-700 transition-colors">
              Ekstrakurikuler
            </Link>
            <ChevronRight size={12} className="text-tosca-200" />
            <span className="text-tosca-700 truncate max-w-[150px] md:max-w-none">{item.nama}</span>
          </nav>

          {/* Grid Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Kolom Kiri: Konten Utama */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <span className="inline-block text-[9px] font-black px-2.5 py-1 bg-tosca-50 text-tosca-600 rounded-full border border-tosca-100 uppercase tracking-widest mb-3">
                  Ekstrakurikuler {unit.toUpperCase()}
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight uppercase">
                  {item.nama}
                </h1>
                {item.jadwal && (
                  <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">
                    Jadwal: {item.jadwal}
                  </p>
                )}
              </div>

              {/* Banner / Image */}
              <div className="relative aspect-[16/9] w-full rounded-[32px] overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.nama} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-tosca-400">
                    <div className="w-24 h-24 rounded-full bg-tosca-50 text-tosca-600 flex items-center justify-center border border-tosca-100 shadow-sm">
                      {getEkskulIcon(item.nama)}
                    </div>
                  </div>
                )}
              </div>

              {/* Deskripsi */}
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
                  Mengenal {item.nama}
                </h2>
                <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {item.deskripsi}
                </p>
              </div>

              {/* Program & Kegiatan */}
              {item.daftarKegiatan && (
                <div className="space-y-4 pt-4">
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
                    Program & Kegiatan
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Array.isArray(item.daftarKegiatan) ? (
                      item.daftarKegiatan.map((kegiatan, index) => (
                        <li key={index} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:border-tosca-200 transition-colors">
                          <span className="w-6 h-6 rounded-full bg-tosca-50 border border-tosca-100 text-tosca-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 font-medium text-sm md:text-base leading-relaxed">
                            {kegiatan}
                          </span>
                        </li>
                      ))
                    ) : (
                      item.daftarKegiatan.split("\n").filter(Boolean).map((kegiatan, index) => (
                        <li key={index} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:border-tosca-200 transition-colors">
                          <span className="w-6 h-6 rounded-full bg-tosca-50 border border-tosca-100 text-tosca-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 font-medium text-sm md:text-base leading-relaxed">
                            {kegiatan}
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}

              {/* Galeri Kegiatan */}
              {item.galeri && item.galeri.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
                    Galeri Kegiatan
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {item.galeri.map((imgUrl, index) => (
                      <div 
                        key={index}
                        onClick={() => handleImageClick(index)}
                        className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group bg-gray-50"
                      >
                        <img 
                          src={imgUrl} 
                          alt={`${item.nama} Galeri - ${index + 1}`} 
                          className="w-full h-full object-cover select-none"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-xs font-bold uppercase tracking-wider text-white bg-black/45 px-3 py-1.5 rounded-full backdrop-blur-sm">
                            Lihat Foto
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lightbox / Modal */}
              {selectedImageIndex !== null && item.galeri && item.galeri[selectedImageIndex] && (
                <ShareableImageModal
                  isOpen={selectedImageIndex !== null}
                  onClose={() => setSelectedImageIndex(null)}
                  imageUrl={item.galeri[selectedImageIndex]}
                  title={`${item.nama} - Foto #${selectedImageIndex + 1}`}
                  description={item.deskripsi}
                  tingkat={unit.toUpperCase()}
                  onPrev={item.galeri.length > 1 ? handlePrevImage : undefined}
                  onNext={item.galeri.length > 1 ? handleNextImage : undefined}
                />
              )}

              {/* Share Buttons */}
              <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <Share2 size={14} /> Bagikan Kegiatan
                </span>
                <div className="flex gap-3">
                  {/* WhatsApp Share */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + (typeof window !== "undefined" ? window.location.href : ""))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all scale-100 hover:scale-105"
                    title="WhatsApp"
                  >
                    <MessageCircle size={18} />
                  </a>
                  {/* Facebook Share */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all scale-100 hover:scale-105"
                    title="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  {/* Twitter/X Share */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white transition-all scale-100 hover:scale-105"
                    title="Twitter / X"
                  >
                    <Twitter size={16} />
                  </a>
                  {/* Copy Link */}
                  <button
                    onClick={handleCopyLink}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-500 hover:text-white transition-all scale-100 hover:scale-105 cursor-pointer"
                    title="Salin Tautan"
                  >
                    <Link2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Card Pendaftaran */}
            <div className="lg:sticky lg:top-36 bg-gray-50 border border-gray-100 rounded-[32px] p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                  Tertarik Bergabung?
                </h3>
                <p className="text-gray-400 font-medium text-xs md:text-sm mt-2 leading-relaxed">
                  Mari kembangkan minat, bakat, dan potensimu bersama pembina ahli kami di kegiatan ekstrakurikuler {item.nama}.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {/* WhatsApp Registration */}
                <a
                  href="https://wa.me/6281534648183?text=Halo%20Admin%2C%20saya%20ingin%20bertanya%20mengenai%20info%20sekolah."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#1EBE57] text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} /> Daftar via WhatsApp
                </a>
                
                {/* Email Registration */}
                <a
                  href="mailto:budimancendikia304@gmail.com"
                  className="w-full py-4 bg-[#0B6B69] hover:bg-[#085351] text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2"
                >
                  <Mail size={16} /> Daftar via Email
                </a>
              </div>

              <div className="pt-4 border-t border-gray-200/50 text-center">
                <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider">
                  Budiman Cendikia Academy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
