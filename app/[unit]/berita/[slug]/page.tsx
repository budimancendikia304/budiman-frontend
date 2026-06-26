"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import PublicLayout from "@/components/PublicLayout";

interface Berita {
  judul: string;
  konten: string;
  thumbnail: string | null;
  kategori: string;
  created_at: string;
}

export default function BeritaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [berita, setBerita] = useState<Berita | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/berita/${params.slug}`);
        setBerita(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.slug) fetchDetail();
  }, [params.slug]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-tosca-500 border-gray-200"></div>
    </div>
  );

  if (!berita) return (
    <PublicLayout unit="sd">
      <div className="pt-48 pb-32 text-center">
         <h1 className="text-2xl font-black text-gray-800">Berita tidak ditemukan.</h1>
         <button onClick={() => router.back()} className="mt-6 text-tosca-700 font-bold hover:underline">← Kembali</button>
      </div>
    </PublicLayout>
  );

  const unit = (params.unit as "sd" | "smp") || "sd";

  return (
    <PublicLayout unit={unit}>
      <article className="pt-32 pb-20 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
           <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                 <span className="px-3 py-1 bg-tosca-50 text-tosca-700 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                    🏷️ {berita.kategori}
                 </span>
                 <span className="text-gray-400 text-xs font-bold flex items-center gap-1">
                    📅 {new Date(berita.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                 </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-8">{berita.judul}</h1>
           </div>

           {berita.thumbnail && (
              <div className="rounded-[48px] overflow-hidden mb-12 shadow-2xl">
                 <img src={berita.thumbnail} alt={berita.judul} className="w-full h-auto" />
              </div>
           )}

           <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed">
              {berita.konten.split('\n').map((para, i) => (
                <p key={i} className="mb-6">{para}</p>
              ))}
           </div>
           
           <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
              <button onClick={() => router.back()} className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-xl transition-all text-sm">← Kembali ke Daftar Berita</button>
              <div className="flex gap-4">
                 {/* Social share icons could go here */}
              </div>
           </div>
        </div>
      </article>
    </PublicLayout>
  );
}
