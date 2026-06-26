"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, ChevronLeft, ChevronRight, User, Award, BookOpen } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import api from "@/lib/api";

// Interface data guru
interface Guru {
  id: number;
  nama: string;
  nip: string | null;
  jabatan: string;
  mata_pelajaran: string | null;
  foto: string | null;
  email: string | null;
  gmail: string | null;
  whatsapp: string | null;
}

export default function PublicGuruDetailPage() {
  const params = useParams() || {};
  const router = useRouter();
  
  // Ambil parameter unit dan id secara aman dengan fallback
  const unit = (params.unit as "sd" | "smp") || "sd";
  const id = params.id as string || "";

  const [guru, setGuru] = useState<Guru | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to format WhatsApp number to international format starting with 62
  const formatWhatsApp = (num: string | null) => {
    if (!num) return "";
    const cleanNum = num.replace(/\D/g, "");
    if (cleanNum.startsWith("0")) {
      return "62" + cleanNum.slice(1);
    }
    if (cleanNum.startsWith("62")) {
      return cleanNum;
    }
    return "62" + cleanNum;
  };

  useEffect(() => {
    // Menghindari fetch jika ID kosong
    if (!id) {
      setError("ID guru tidak valid.");
      setIsLoading(false);
      return;
    }

    const fetchGuruDetail = async () => {
      try {
        setError(null);
        const response = await api.get(`/guru/${id}`);
        
        // Memastikan data valid
        if (response && response.data) {
          setGuru(response.data);
        } else {
          setError("Gagal memuat data guru.");
        }
      } catch (err: unknown) {
        console.error("Gagal mengambil detail guru:", err);
        setError("Data guru tidak ditemukan atau sedang tidak aktif.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuruDetail();
  }, [id]);

  // Handler untuk kembali ke halaman daftar guru secara aman
  const handleGoBack = () => {
    try {
      router.push(`/${unit}/guru`);
    } catch (err) {
      console.error("Gagal mengarahkan kembali:", err);
    }
  };

  return (
    <PublicLayout unit={unit}>
      <div className="pt-8 pb-32 bg-bg-utama min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Breadcrumb navigasi */}
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-8" style={{ color: "var(--warna-teks-mutlak)" }}>
            <Link href={`/${unit}`} className="hover:opacity-85 transition-opacity">
              Beranda
            </Link>
            <ChevronRight size={12} style={{ color: "var(--bg-tombol-utama)" }} />
            <Link href={`/${unit}/guru`} className="hover:opacity-85 transition-opacity">
              Guru
            </Link>
            <ChevronRight size={12} style={{ color: "var(--bg-tombol-utama)" }} />
            <span style={{ color: "var(--warna-teks-mutlak)" }} className="truncate max-w-[200px]">
              {guru?.nama || "Detail Guru"}
            </span>
          </nav>

          {/* Tombol Kembali dengan Efek Hover 3D */}
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl mb-10 text-xs font-black uppercase tracking-widest transition-all duration-300"
            style={{
              backgroundColor: "var(--warna-sorotan)",
              color: "var(--warna-teks-mutlak)",
              border: "1px solid var(--border-halus)",
              boxShadow: "0 4px 12px rgba(11, 107, 105, 0.08)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-tombol-utama)";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(11, 107, 105, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--warna-sorotan)";
              e.currentTarget.style.color = "var(--warna-teks-mutlak)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(11, 107, 105, 0.08)";
            }}
          >
            <ChevronLeft size={16} /> Kembali ke Daftar
          </button>

          {/* Area Utama Detail Guru */}
          {isLoading ? (
            <div className="flex justify-center py-20 bg-white rounded-[40px] border border-border-halus shadow-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-bg-tombol-utama border-gray-100"></div>
            </div>
          ) : error ? (
            // Penanganan Kesalahan jika data guru tidak ditemukan
            <div className="bg-white p-12 text-center rounded-[40px] border border-border-halus shadow-lg">
              <User size={48} style={{ color: "var(--bg-tombol-utama)", margin: "0 auto 20px" }} />
              <h2 className="text-2xl font-black mb-4" style={{ color: "var(--warna-teks-mutlak)" }}>Profil Tidak Tersedia</h2>
              <p className="font-medium mb-8" style={{ color: "var(--bg-tombol-utama)" }}>{error}</p>
              <button 
                onClick={handleGoBack}
                className="px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all"
                style={{ backgroundColor: "var(--warna-sorotan)", color: "var(--warna-teks-mutlak)" }}
              >
                Kembali ke Daftar Guru
              </button>
            </div>
          ) : (
            guru && (
              <div 
                className="bg-white rounded-[40px] border overflow-hidden flex flex-col md:flex-row shadow-lg transition-all duration-300"
                style={{
                  borderColor: "var(--border-halus)",
                  boxShadow: "0 15px 35px rgba(11, 107, 105, 0.08)"
                }}
              >
                {/* Bagian Foto Profil */}
                <div className="w-full md:w-[360px] flex-shrink-0 aspect-[3/4] md:aspect-auto md:min-h-[480px] bg-bg-utama overflow-hidden relative border-b md:border-b-0 md:border-r" style={{ borderColor: "var(--border-halus)" }}>
                  <img
                    src={
                      guru.foto ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(guru.nama)}&background=2FCFC9&color=0B6B69&size=512`
                    }
                    alt={guru.nama}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Bagian Deskripsi Detail */}
                <div className="p-8 md:p-12 flex flex-col justify-center flex-1">
                  
                  {/* Jabatan */}
                  <span className="text-xs font-black uppercase tracking-[0.2em] mb-3 block" style={{ color: "var(--bg-tombol-utama)" }}>
                    {guru.jabatan || "Tenaga Pendidik"}
                  </span>
                  
                  {/* Nama */}
                  <h1 className="text-3xl md:text-4xl font-black leading-tight mb-8" style={{ color: "var(--warna-teks-mutlak)" }}>
                    {guru.nama}
                  </h1>

                  <div className="space-y-6">
                    {/* NIP */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl" style={{ backgroundColor: "var(--bg-utama)" }}>
                      <Award size={20} style={{ color: "var(--warna-teks-mutlak)", marginTop: "2px" }} className="shrink-0" />
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest block mb-1" style={{ color: "var(--bg-tombol-utama)" }}>
                          Nomor Induk Pegawai (NIP)
                        </span>
                        <span className="font-bold text-sm" style={{ color: "var(--warna-teks-mutlak)" }}>
                          {guru.nip || "NIP Belum Tercatat"}
                        </span>
                      </div>
                    </div>

                    {/* Mata Pelajaran */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl" style={{ backgroundColor: "var(--bg-utama)" }}>
                      <BookOpen size={20} style={{ color: "var(--warna-teks-mutlak)", marginTop: "2px" }} className="shrink-0" />
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest block mb-1" style={{ color: "var(--bg-tombol-utama)" }}>
                          Mata Pelajaran Pengampu
                        </span>
                        <span className="font-bold text-sm" style={{ color: "var(--warna-teks-mutlak)" }}>
                          {guru.mata_pelajaran || "Tenaga Kependidikan / Staf"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bagian Hubungi Guru (Hubungi Via WhatsApp / Email) */}
                  <div className="mt-10 pt-8 border-t" style={{ borderColor: "var(--bg-utama)" }}>
                    <h3 className="text-xs font-black uppercase tracking-[0.25em] mb-5" style={{ color: "var(--bg-tombol-utama)" }}>
                      Hubungi Guru
                    </h3>
                    
                    <div className="flex flex-wrap gap-4">
                      {/* WhatsApp */}
                      {guru.whatsapp ? (
                        <a
                          href={`https://wa.me/${formatWhatsApp(guru.whatsapp)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300"
                          style={{
                            backgroundColor: "var(--warna-sorotan)",
                            color: "var(--warna-teks-mutlak)",
                            boxShadow: "0 4px 12px rgba(11, 107, 105, 0.05)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--bg-tombol-utama)";
                            e.currentTarget.style.color = "#FFFFFF";
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--warna-sorotan)";
                            e.currentTarget.style.color = "var(--warna-teks-mutlak)";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <Phone size={16} /> WhatsApp
                        </a>
                      ) : (
                        <span className="text-xs font-bold py-3.5 px-5 rounded-2xl" style={{ backgroundColor: "var(--bg-utama)", color: "var(--warna-teks-mutlak)" }}>
                          No WhatsApp Tidak Tersedia
                        </span>
                      )}

                      {/* Gmail / Email */}
                      {(guru.gmail || guru.email) ? (
                        <a
                          href={`mailto:${guru.gmail || guru.email}`}
                          className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300"
                          style={{
                            backgroundColor: "var(--bg-komponen)",
                            color: "var(--warna-teks-mutlak)",
                            border: "1px solid var(--border-halus)",
                            boxShadow: "0 4px 12px rgba(11, 107, 105, 0.05)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--bg-utama)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--bg-komponen)";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <Mail size={16} /> Kirim Email
                        </a>
                      ) : (
                        <span className="text-xs font-bold py-3.5 px-5 rounded-2xl" style={{ backgroundColor: "var(--bg-utama)", color: "var(--warna-teks-mutlak)" }}>
                          Email Tidak Tersedia
                        </span>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            )
          )}

        </div>
      </div>
    </PublicLayout>
  );
}
