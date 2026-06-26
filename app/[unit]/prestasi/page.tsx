"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import PublicLayout from "@/components/PublicLayout";
import ImageModal from "@/components/ImageModal";
import { Calendar, Award, Trophy } from "lucide-react";
import { getImageUrl, IMAGE_PLACEHOLDER } from "@/lib/imageHelper";

interface Prestasi {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  image: string | null;
  kategori: string;
  tingkat: string;
}

export default function PrestasiPublicPage() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";
  
  const [prestasi, setPrestasi] = useState<Prestasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    const fetchPrestasi = async () => {
      try {
        const res = await api.get(`/prestasi?unit=${unit}`);
        setPrestasi(res.data);
      } catch (err) {
        console.error("Gagal mengambil data prestasi:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrestasi();
  }, [unit]);

  const handleImageClick = (imageUrl: string, title: string) => {
    setSelectedImage(imageUrl);
    setSelectedTitle(title);
  };

  return (
    <PublicLayout unit={unit}>
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-tosca-50 text-tosca-600 mb-6 shadow-sm border border-tosca-100">
            <Trophy size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight uppercase mb-4">
            Daftar <span className="text-tosca-600">Prestasi</span> Siswa
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            Kebanggaan keluarga besar Budiman Cendikia. Inilah jejak prestasi dan dedikasi siswa-siswi terbaik kami dalam meraih mimpi.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-tosca-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {prestasi.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                {/* Image / Thumbnail */}
                <div 
                  className="relative aspect-[4/3] overflow-hidden bg-tosca-50 cursor-pointer"
                  onClick={() => handleImageClick(getImageUrl(item.image), item.judul)}
                >
                  <img 
                    src={getImageUrl(item.image)} 
                    alt={item.judul} 
                    onError={(e) => {
                      e.currentTarget.src = IMAGE_PLACEHOLDER;
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-tosca-700 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                      {item.tingkat}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={12} className="text-gray-300" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(item.tanggal).getFullYear()}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-800 leading-tight mb-4 group-hover:text-tosca-600 transition-colors line-clamp-2">
                    {item.judul}
                  </h3>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Kategori: {item.kategori}
                    </span>
                    <button 
                      onClick={() => handleImageClick(getImageUrl(item.image), item.judul)}
                      className="text-tosca-600 font-black text-[10px] uppercase tracking-widest hover:text-tosca-800 transition-colors"
                    >
                      Lihat Foto
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {prestasi.length === 0 && (
              <div className="col-span-full py-24 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                <Trophy size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Belum ada data prestasi yang ditampilkan.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <ImageModal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        imageUrl={selectedImage || ""} 
        title={selectedTitle}
      />
    </PublicLayout>
  );
}
