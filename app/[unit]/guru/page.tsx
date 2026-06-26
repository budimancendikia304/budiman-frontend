"use client";

import { useEffect, useState } from "react";
import { Quote, Mail, Phone } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

interface Guru {
  id: number;
  nama: string;
  jabatan: string;
  mata_pelajaran: string | null;
  foto: string | null;
  gmail: string | null;
  whatsapp: string | null;
}

export default function PublicGuruPage() {
  const params = useParams();
  const unit = params?.unit as "sd" | "smp" | undefined;
  const [guru, setGuru] = useState<Guru[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (!unit) return;

    const fetchGuru = async () => {
      try {
        const response = await api.get(`/guru?unit=${unit}`);
        setGuru(response.data);
      } catch (error) {
        console.error("Gagal mengambil data guru:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuru();
  }, [unit]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-12");
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".scroll-animate").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [guru]); // Re-run when guru data loads

  const kepalaSekolah = guru.length > 0 ? guru[0] : null;
  const daftarGuru = guru.length > 1 ? guru.slice(1) : [];

  if (!unit) {
    return null;
  }

  return (
    <PublicLayout unit={unit}>
      <div className="pt-16 pb-32 bg-[#F8FAFC] min-h-screen">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-6 text-center mb-20 scroll-animate opacity-0 translate-y-12 transition-all duration-1000 ease-out">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-tosca-50 text-tosca-700 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-tosca-100">
            Tim Akademik
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
            Guru dan Tenaga Kependidikan
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Mengenal lebih dekat para pendidik dan profesional yang membimbing
            putra-putri Anda menuju masa depan cemerlang.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-tosca-500 border-gray-200"></div>
            </div>
          ) : (
            <>
              {/* Profil Staf Inti (Horizontal Card) */}
              {kepalaSekolah && (
                <div className="bg-white rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500 scroll-animate opacity-0 translate-y-12">
                  <div className="w-full md:w-[400px] bg-tosca-50 flex-shrink-0 overflow-hidden aspect-[3/4]">
                    <Link
                      href={`/${unit}/guru/${kepalaSekolah.id}`}
                      className="block w-full h-full"
                    >
                      <img
                        src={
                          kepalaSekolah.foto ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(kepalaSekolah.nama)}&background=2FCFC9&color=fff&size=512`
                        }
                        alt={kepalaSekolah.nama}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </Link>
                  </div>
                  <div className="p-10 md:p-14 flex flex-col justify-center flex-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-tosca-900 pointer-events-none transform -rotate-12">
                      <Quote size={120} />
                    </div>

                    <span className="text-sm font-black text-tosca-500 uppercase tracking-widest mb-2 block">
                      {kepalaSekolah.jabatan}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                      <Link
                        href={`/${unit}/guru/${kepalaSekolah.id}`}
                        className="hover:text-tosca-600 hover:underline transition-colors"
                      >
                        {kepalaSekolah.nama}
                      </Link>
                    </h2>

                    <div className="relative">
                      <p className="text-lg text-gray-500 font-medium leading-relaxed italic relative z-10">
                        &quot;Pendidikan bukan sekadar transfer ilmu, melainkan
                        proses menumbuhkan karakter, menggali potensi, dan
                        menginspirasi siswa untuk menjadi pembelajar sepanjang
                        hayat. Kami berkomitmen memberikan lingkungan terbaik
                        bagi perkembangan mereka.&quot;
                      </p>
                    </div>

                    {kepalaSekolah.mata_pelajaran && (
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                          Mata Pelajaran
                        </span>
                        <span className="text-gray-800 font-bold">
                          {kepalaSekolah.mata_pelajaran}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Grid Daftar Guru */}
              {daftarGuru.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                  {daftarGuru.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 hover:border-tosca-200 transition-all duration-500 group flex flex-col scroll-animate opacity-0 translate-y-12"
                      style={{ transitionDelay: `${(index % 4) * 100}ms` }}
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-tosca-50 relative">
                        <Link
                          href={`/${unit}/guru/${item.id}`}
                          className="block w-full h-full"
                        >
                          <img
                            src={
                              item.foto ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nama)}&background=2FCFC9&color=fff&size=512`
                            }
                            alt={item.nama}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </Link>

                        {/* Overlay Contacts */}
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-center gap-4 z-20">
                          {item.gmail && (
                            <a
                              href={`mailto:${item.gmail}`}
                              onClick={(e) => e.stopPropagation()}
                              className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-tosca-600 transition-all"
                              title="Kirim Email"
                            >
                              <Mail size={20} />
                            </a>
                          )}
                          {item.whatsapp && (
                            <a
                              href={`https://wa.me/${formatWhatsApp(item.whatsapp)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-[#25D366] hover:text-white transition-all"
                              title="Hubungi WhatsApp"
                            >
                              <Phone size={20} />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="p-8 flex flex-col flex-1">
                        <span className="text-[10px] font-black text-tosca-500 uppercase tracking-[0.2em] mb-3 block">
                          {item.jabatan}
                        </span>
                        <h4 className="text-xl font-black text-gray-900 leading-tight mb-4 group-hover:text-tosca-600 transition-colors">
                          <Link
                            href={`/${unit}/guru/${item.id}`}
                            className="hover:underline"
                          >
                            {item.nama}
                          </Link>
                        </h4>

                        {item.mata_pelajaran && (
                          <div className="pt-5 border-t border-gray-100 mt-auto flex items-center justify-between">
                            <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                Pengampu
                              </p>
                              <p className="text-gray-700 text-sm font-black tracking-tight">
                                {item.mata_pelajaran}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {item.gmail && (
                                <Mail size={14} className="text-gray-300" />
                              )}
                              {item.whatsapp && (
                                <Phone size={14} className="text-gray-300" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
