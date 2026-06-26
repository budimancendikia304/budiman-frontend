"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

interface Guru {
  id: number;
  nama: string;
  jabatan: string;
  mata_pelajaran: string | null;
  foto: string | null;
}

export default function GuruMarquee({ unit }: { unit: "sd" | "smp" }) {
  const [guru, setGuru] = useState<Guru[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  if (isLoading || guru.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden py-10 group">
      {/* Efek gradien bayangan di sisi kiri dan kanan */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none"></div>

      {/* Track Marquee Pembungkus */}
      <div className="flex w-max">
        {/* Style block for pure CSS marquee */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marqueeScroll-${unit} {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee-${unit} {
            animation: marqueeScroll-${unit} 25s linear infinite;
          }
          .group:hover .animate-marquee-${unit} {
            animation-play-state: paused;
          }
        `}} />

        {/* Set Pertama */}
        <div className={`flex gap-8 pr-8 shrink-0 animate-marquee-${unit}`}>
          {guru.map((item) => (
            <Link 
              key={`${item.id}-first`} 
              href={`/${unit}/guru/${item.id}`}
              className="w-64 bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-2xl hover:-translate-y-2 hover:border-tosca-200 cursor-pointer group/card shrink-0"
            >
              <div className="aspect-[3/4] w-full bg-tosca-50 overflow-hidden relative">
                {item.foto ? (
                  <img src={item.foto} alt={item.nama} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-tosca-500 font-black text-4xl">{item.nama.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className="p-6 text-center">
                <h4 className="text-lg font-black text-gray-800 leading-tight mb-1 group-hover/card:text-tosca-600 transition-colors">{item.nama}</h4>
                <p className="text-tosca-700 font-bold text-[10px] uppercase tracking-[0.2em]">{item.jabatan}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Set Kedua (Duplikat untuk Seamless Loop) */}
        <div className={`flex gap-8 pr-8 shrink-0 animate-marquee-${unit}`} aria-hidden="true">
          {guru.map((item) => (
            <Link 
              key={`${item.id}-second`} 
              href={`/${unit}/guru/${item.id}`}
              className="w-64 bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-2xl hover:-translate-y-2 hover:border-tosca-200 cursor-pointer group/card shrink-0"
            >
              <div className="aspect-[3/4] w-full bg-tosca-50 overflow-hidden relative">
                {item.foto ? (
                  <img src={item.foto} alt={item.nama} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-tosca-500 font-black text-4xl">{item.nama.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className="p-6 text-center">
                <h4 className="text-lg font-black text-gray-800 leading-tight mb-1 group-hover/card:text-tosca-600 transition-colors">{item.nama}</h4>
                <p className="text-tosca-700 font-bold text-[10px] uppercase tracking-[0.2em]">{item.jabatan}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
