"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PublicLayout from "@/components/PublicLayout";
import { ChevronRight, Beaker, BookOpen, Cpu, FileText } from "lucide-react";

interface Ekstrakurikuler {
  id: number;
  nama: string;
  deskripsi: string;
  jadwal: string;
  image: string;
  is_aktif: boolean;
  slug?: string;
}

const DEFAULT_EKSKUL = [
  {
    id: 1,
    nama: "Sains Lab",
    deskripsi: "Eksplorasi eksperimen ilmiah seru, mengasah logika, dan menumbuhkan kecintaan terhadap ilmu pengetahuan alam.",
    jadwal: "Rabu, 14.00 - 15.30",
    image: "",
    is_aktif: true,
    slug: "sains-lab"
  },
  {
    id: 2,
    nama: "Tahfidz Qur'an",
    deskripsi: "Program bimbingan menghafal Al-Qur'an secara tartil, menanamkan nilai luhur islam, dan membentuk karakter mulia.",
    jadwal: "Kamis, 14.00 - 15.30",
    image: "",
    is_aktif: true,
    slug: "tahfidz-quran"
  },
  {
    id: 3,
    nama: "Digital Program",
    deskripsi: "Pengenalan dasar teknologi, pemrograman visual (scratch), robotika sederhana, dan literasi digital masa depan.",
    jadwal: "Jumat, 14.00 - 15.30",
    image: "",
    is_aktif: true,
    slug: "digital-program"
  }
];

const getEkskulIcon = (name: string) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("sains") || lowercaseName.includes("science") || lowercaseName.includes("lab")) {
    return <Beaker size={28} />;
  }
  if (lowercaseName.includes("tahfidz") || lowercaseName.includes("qur'an") || lowercaseName.includes("agama") || lowercaseName.includes("islam")) {
    return <BookOpen size={28} />;
  }
  if (lowercaseName.includes("digital") || lowercaseName.includes("program") || lowercaseName.includes("coding") || lowercaseName.includes("computer") || lowercaseName.includes("it")) {
    return <Cpu size={28} />;
  }
  return <FileText size={28} />;
};

export default function EkstrakurikulerIndexPage() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";
  const [ekskul, setEkskul] = useState<Ekstrakurikuler[]>([]);

  useEffect(() => {
    try {
      const storageKey = `ekstrakurikuler_${unit}`;
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        setEkskul(JSON.parse(savedData).filter((i: any) => i.is_aktif));
      } else {
        localStorage.setItem(storageKey, JSON.stringify(DEFAULT_EKSKUL));
        setEkskul(DEFAULT_EKSKUL);
      }
    } catch {
      setEkskul(DEFAULT_EKSKUL);
    }
  }, [unit]);

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
            <span className="text-tosca-400">Profil Sekolah</span>
            <ChevronRight size={12} className="text-tosca-200" />
            <span className="text-tosca-700">Ekstrakurikuler</span>
          </nav>

          {/* Heading */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-tosca-900 tracking-tight mb-2 uppercase">
              Ekstrakurikuler
            </h1>
            <p className="text-gray-400 font-medium text-sm md:text-base mt-2 max-w-xl">
              Daftar kegiatan pengembangan bakat dan kreativitas siswa di lingkungan Budiman Cendikia {unit.toUpperCase()}.
            </p>
            <div className="h-1.5 w-24 bg-tosca-500 rounded-full mt-4"></div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ekskul.length > 0 ? (
              ekskul.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/${unit}/ekstrakurikuler/${item.slug || item.id}`}
                  className="bg-white border border-gray-100 rounded-[28px] p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full bg-tosca-50 text-tosca-600 flex items-center justify-center mb-6 overflow-hidden border border-tosca-100 shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {item.image ? (
                      <img src={item.image} alt={item.nama} className="w-full h-full object-cover" />
                    ) : (
                      getEkskulIcon(item.nama)
                    )}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 group-hover:text-tosca-500 uppercase tracking-tight mb-3 transition-colors">
                    {item.nama}
                  </h3>
                  <p className="text-gray-400 font-medium text-xs md:text-sm leading-relaxed mb-4 flex-1">
                    {item.deskripsi}
                  </p>
                  {item.jadwal && (
                    <div className="mt-auto px-4 py-1.5 bg-gray-50 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">
                      Jadwal: {item.jadwal}
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 text-gray-400 font-bold">
                Belum ada data kegiatan ekstrakurikuler.
              </div>
            )}
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
