"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import PublicLayout from "@/components/PublicLayout";
import { ChevronLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getImageUrl, IMAGE_PLACEHOLDER } from "@/lib/imageHelper";

interface ProgramItem {
  id: number;
  nama: string;
  deskripsi: string;
  ikon: string | null;
  unit: "sd" | "smp";
}

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const unit = params.unit as "sd" | "smp";
  const slug = params.slug as string;

  const [item, setItem] = useState<ProgramItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/program-fasilitas/${slug}`);
        setItem(response.data);
      } catch (error) {
        console.error("Failed to fetch program detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchDetail();
  }, [slug]);

  if (isLoading) {
    return (
      <PublicLayout unit={unit}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tosca-500"></div>
        </div>
      </PublicLayout>
    );
  }

  if (!item) {
    return (
      <PublicLayout unit={unit}>
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Item Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-8">Maaf, program atau fasilitas yang Anda cari tidak tersedia.</p>
          <button 
            onClick={() => router.back()}
            className="px-8 py-3 bg-tosca-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-tosca-500/20"
          >
            Kembali
          </button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout unit={unit}>
      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <section className="relative pt-20 pb-32 overflow-hidden bg-tosca-50/30">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-tosca-500/5 -z-10 blur-3xl rounded-full translate-x-1/2"></div>
          
          <div className="max-w-5xl mx-auto px-6">
            <Link 
              href={`/${unit}`}
              className="inline-flex items-center gap-2 text-tosca-600 font-black uppercase tracking-widest text-[10px] mb-12 hover:gap-3 transition-all"
            >
              <ChevronLeft size={16} /> Kembali ke Beranda
            </Link>

            <div className="flex flex-col gap-10">
              <div>
                <span className="px-4 py-1.5 bg-tosca-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-tosca-500/20 mb-5 inline-block">
                  Program Unggulan
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
                  {item.nama}
                </h1>
                <div className="h-2 w-20 bg-tosca-500 rounded-full"></div>
              </div>

                <div className="w-full rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl shadow-tosca-500/10 border border-gray-100/50">
                  <img 
                    src={getImageUrl(item.ikon)} 
                    alt={item.nama} 
                    onError={(e) => {
                      e.currentTarget.src = IMAGE_PLACEHOLDER;
                    }}
                    className="w-full h-auto max-h-[550px] object-cover object-center" 
                  />
                </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 -mt-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white rounded-[60px] p-8 md:p-16 shadow-2xl shadow-gray-200/50 border border-gray-50">
              <div className="prose prose-lg max-w-none text-gray-500 font-medium leading-relaxed whitespace-pre-wrap">
                {item.deskripsi}
              </div>

              <div className="mt-16 pt-16 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                <div>
                  <h4 className="text-xl font-black text-gray-900 mb-2">Tertarik dengan Program Ini?</h4>
                  <p className="text-gray-400 font-medium">Dapatkan informasi lebih lanjut melalui layanan informasi kami.</p>
                </div>
                <Link 
                  href={`/${unit}/ppdb`}
                  className="px-10 py-5 bg-tosca-900 text-white rounded-[32px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-tosca-900/30 hover:-translate-y-1 transition-all flex items-center gap-3"
                >
                  Daftar Sekarang <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
