"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Youtube, Facebook } from "lucide-react";
import ShareableImageModal from "@/components/ShareableImageModal";

interface Prestasi {
  title: string;
  category: string;
  date: string;
  description: string;
  image: string;
}

export default function Home() {
  const [selectedPrestasi, setSelectedPrestasi] = useState<Prestasi | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C8F7F5]/30 via-[#F8FAFC] to-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#7EE6E3] rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#2FCFC9] rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-20"></div>

      <div className="max-w-5xl w-full text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white rounded-full shadow-sm border border-[#7EE6E3] mb-8 animate-bounce">
          <span className="w-2 h-2 bg-[#2FCFC9] rounded-full"></span>
          <span className="text-xs font-black text-[#0B6B69] uppercase tracking-widest">Official School Portal</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight leading-tight bg-gradient-to-r from-[#2FCFC9] via-[#0FA8A4] to-[#0B6B69] bg-clip-text text-transparent pb-2">
          Budiman Cendikia
        </h1>
        <p className="text-xl text-gray-500 mb-16 font-medium max-w-2xl mx-auto leading-relaxed">
          Mencetak generasi cerdas, berakhlak mulia, dan siap menghadapi tantangan masa depan melalui pendidikan berkualitas di jenjang SD & SMP.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* SD Card */}
          <Link
            href="/sd"
            className="group relative bg-white rounded-[48px] shadow-xl overflow-hidden transform transition-all duration-500 hover:-translate-y-4 hover:shadow-[#2FCFC9]/20 border border-gray-100"
          >
            <div className="h-56 bg-gradient-to-tr from-[#2FCFC9] to-[#0FA8A4] flex items-center justify-center relative overflow-hidden">
              <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <span className="text-5xl font-black !text-[#ffffff]">SD</span>
              </div>
            </div>
            <div className="p-10">
              <h2 className="text-3xl font-black text-gray-900 group-hover:text-[#0B6B69] transition-colors">Unit SD</h2>
              <p className="mt-4 text-gray-400 font-medium leading-relaxed">
                Portal informasi resmi dan pendaftaran online untuk jenjang Sekolah Dasar Budiman Cendikia.
              </p>
              <div className="mt-8 flex items-center justify-center gap-2 text-[#0FA8A4] font-black uppercase tracking-widest text-sm">
                Kunjungi Website <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* SMP Card */}
          <Link
            href="/smp"
            className="group relative bg-white rounded-[48px] shadow-xl overflow-hidden transform transition-all duration-500 hover:-translate-y-4 hover:shadow-[#0B6B69]/20 border border-gray-100"
          >
            <div className="h-56 bg-gradient-to-tr from-[#0FA8A4] to-[#0B6B69] flex items-center justify-center relative overflow-hidden">
              <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <span className="text-5xl font-black !text-[#ffffff]">SMP</span>
              </div>
            </div>
            <div className="p-10">
              <h2 className="text-3xl font-black text-gray-900 group-hover:text-[#0B6B69] transition-colors">Unit SMP</h2>
              <p className="mt-4 text-gray-400 font-medium leading-relaxed">
                Portal informasi resmi dan pendaftaran online untuk jenjang SMP Budiman Cendikia.
              </p>
              <div className="mt-8 flex items-center justify-center gap-2 text-[#0B6B69] font-black uppercase tracking-widest text-sm">
                Kunjungi Website <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-200/50 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-400 font-bold text-xs uppercase tracking-widest">
          <p>© 2026 Budiman Cendikia Educational Foundation</p>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/sat_almanshurah/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#0FA8A4] transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-[#0FA8A4] transition-colors">
              <Youtube size={20} />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-[#0FA8A4] transition-colors">
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </div>

      <ShareableImageModal
        isOpen={!!selectedPrestasi}
        onClose={() => setSelectedPrestasi(null)}
        imageUrl={selectedPrestasi?.image || ""}
        title={selectedPrestasi?.title || ""}
        description={selectedPrestasi?.description || ""}
      />
    </div>
  );
}
