"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { X, ImagePlus, Save, Undo2, UploadCloud } from "lucide-react";

export default function BeritaForm({ unit }: { unit: "sd" | "smp" }) {
  const router = useRouter();
  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [konten, setKonten] = useState("");
  const [kategori, setKategori] = useState("umum");
  const [isPublished, setIsPublished] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let thumbnailUrl = "";
      if (thumbnail) {
        const formData = new FormData();
        formData.append("file", thumbnail);
        formData.append("path", `berita/${unit}`);
        const uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        thumbnailUrl = uploadRes.data.url;
      }

      await api.post("/berita", {
        unit,
        tanggal,
        judul,
        konten,
        kategori,
        thumbnail: thumbnailUrl,
        is_published: isPublished,
      });
      toast.success("Berita berhasil ditambahkan!");
      router.push(`/admin/${unit}/berita`);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Gagal menambahkan berita.";
      toast.error(msg);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const themeBtn = unit === "sd" ? "bg-tosca-500 hover:bg-tosca-700 shadow-tosca-500/30" : "bg-tosca-700 hover:bg-tosca-900 shadow-tosca-700/30";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-sm border border-gray-100 space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div>
            <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3">Judul Berita</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
              className="w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50 font-bold"
              placeholder="Masukkan judul berita yang menarik..."
            />
          </div>

          <div>
            <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3">Tanggal Konten</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50 font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3">Isi Konten</label>
            <textarea
              value={konten}
              onChange={(e) => setKonten(e.target.value)}
              required
              rows={10}
              className="w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50 leading-relaxed"
              placeholder="Tulis detail berita secara lengkap di sini..."
            ></textarea>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div>
            <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3">Gambar Sampul</label>
            <div className="relative group">
               <div className={`aspect-video rounded-2xl md:rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden bg-gray-50/50 group-hover:border-tosca-500 transition-all ${preview ? 'border-solid' : ''}`}>
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4 md:p-6 flex flex-col items-center gap-2 md:gap-3">
                       <ImagePlus size={32} className="md:w-10 md:h-10 text-gray-300 group-hover:text-tosca-500 transition-colors" />
                       <p className="text-[10px] md:text-xs font-bold text-gray-400">Pilih gambar sampul</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
               </div>
               {preview && (
                 <button 
                  type="button" 
                  onClick={() => {setThumbnail(null); setPreview(null)}}
                  className="absolute top-2 right-2 w-7 h-7 md:w-8 md:h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                 >
                   <X size={14} className="md:w-4 md:h-4" />
                 </button>
               )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50 font-bold appearance-none cursor-pointer"
            >
              <option value="umum">Umum / Berita Sekolah</option>
              <option value="prestasi">Prestasi Siswa/Guru</option>
              <option value="kegiatan">Kegiatan Ekstrakurikuler</option>
            </select>
          </div>

          <div className="p-4 md:p-6 bg-gray-50 rounded-[24px] md:rounded-[32px] border border-gray-100">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-xs md:text-sm font-black text-gray-800 uppercase tracking-tighter">Publish Konten</p>
                   <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">Visibility: Publik</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 md:w-11 md:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-tosca-500"></div>
                </label>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-6 md:pt-8 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all flex items-center justify-center"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full sm:w-auto px-8 py-3 md:px-12 md:py-4 rounded-xl md:rounded-2xl text-white font-black text-[10px] md:text-xs uppercase tracking-widest transition-all flex items-center justify-center shadow-lg ${themeBtn} ${isLoading ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:-translate-y-1'}`}
        >
          {isLoading ? 'Sedang Memproses...' : 'Simpan & Publikasikan'}
        </button>
      </div>
    </form>
  );
}
