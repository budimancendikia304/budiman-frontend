"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Trash2, Calendar, FileText } from "lucide-react";

interface Ekstrakurikuler {
  id: number;
  nama: string;
  deskripsi: string;
  jadwal: string;
  image: string;
  is_aktif: boolean;
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

export default function EkstrakurikulerList({ unit }: { unit: "sd" | "smp" }) {
  const [items, setItems] = useState<Ekstrakurikuler[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storageKey = `ekstrakurikuler_${unit}`;
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        setItems(JSON.parse(savedData));
      } else {
        localStorage.setItem(storageKey, JSON.stringify(DEFAULT_EKSKUL));
        setItems(DEFAULT_EKSKUL);
      }
    } catch (err) {
      console.error("Failed to load extracurriculars from localStorage:", err);
      toast.error("Gagal memuat data ekstrakurikuler.");
    } finally {
      setIsLoading(false);
    }
  }, [unit]);

  const handleDelete = (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus ekstrakurikuler ini?")) return;
    try {
      const storageKey = `ekstrakurikuler_${unit}`;
      const updated = items.filter(item => item.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setItems(updated);
      toast.success("Ekstrakurikuler berhasil dihapus!");
    } catch {
      toast.error("Gagal menghapus ekstrakurikuler.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tosca-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="p-6 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Gambar / Ikon</th>
              <th className="p-6 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Nama Ekstrakurikuler</th>
              <th className="p-6 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Deskripsi</th>
              <th className="p-6 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Jadwal</th>
              <th className="p-6 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="p-6 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-6">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.nama} 
                        className="w-14 h-14 rounded-2xl object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-tosca-50 text-tosca-600 flex items-center justify-center border border-tosca-100">
                        <FileText size={20} />
                      </div>
                    )}
                  </td>
                  <td className="p-6 font-bold text-gray-900">{item.nama}</td>
                  <td className="p-6 text-gray-400 text-sm max-w-xs truncate">{item.deskripsi}</td>
                  <td className="p-6 text-gray-500 text-xs font-semibold flex items-center gap-1.5 mt-4">
                    <Calendar size={14} className="text-gray-400" />
                    {item.jadwal || "-"}
                  </td>
                  <td className="p-6">
                    <span className={`inline-block px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-full ${item.is_aktif ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                      {item.is_aktif ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-400 font-bold">
                  Belum ada data ekstrakurikuler.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
