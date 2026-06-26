"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ImagePlus, Megaphone, Undo2, X, UploadCloud } from "lucide-react";

export default function PengumumanForm({ unit }: { unit: "sd" | "smp" }) {
  const router = useRouter();
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [isAktif, setIsAktif] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = "";
      if (image) {
        const uploadData = new FormData();
        uploadData.append("file", image);
        uploadData.append("path", `pengumuman/${unit}`);
        const uploadRes = await api.post("/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        imageUrl = uploadRes.data.url;
      }

      await api.post("/pengumuman", {
        unit,
        judul,
        isi,
        image: imageUrl,
        is_aktif: isAktif,
      });
      toast.success("Pengumuman berhasil diterbitkan!");
      router.push(`/admin/${unit}/pengumuman`);
    } catch {
      toast.error("Gagal menerbitkan pengumuman.");
    } finally {
      setIsLoading(false);
    }
  };

  const themeBtn = unit === "sd" ? "bg-tosca-500 hover:bg-tosca-700 shadow-tosca-500/30" : "bg-tosca-700 hover:bg-tosca-900 shadow-tosca-700/30";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-sm border border-gray-100 space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
         <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div>
               <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Judul Pengumuman</label>
               <input type="text" value={judul} onChange={e => setJudul(e.target.value)} required className="w-full px-4 py-3 md:px-5 md:py-3 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 outline-none font-bold" placeholder="Judul informasi resmi..." />
            </div>
            <div>
               <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Isi Pengumuman</label>
               <textarea value={isi} onChange={e => setIsi(e.target.value)} rows={6} required className="w-full px-4 py-3 md:px-5 md:py-3 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 outline-none leading-relaxed" placeholder="Tuliskan detail pengumuman di sini..."></textarea>
            </div>
         </div>

         <div className="space-y-6 md:space-y-8">
            <div>
               <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3">Gambar Lampiran (Opsional)</label>
               <div className="relative aspect-square rounded-[24px] md:rounded-[32px] border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center group hover:border-tosca-500 transition-all">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4 md:p-6 flex flex-col items-center gap-2 md:gap-3">
                       <ImagePlus size={32} className="text-gray-300 group-hover:text-tosca-500 transition-colors" />
                       <p className="text-[10px] md:text-xs font-bold text-gray-400">Pilih lampiran gambar</p>
                    </div>
                  )}
                  <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
               </div>
               {preview && (
                 <button 
                  type="button" 
                  onClick={() => {setImage(null); setPreview(null)}}
                  className="absolute top-2 right-2 w-7 h-7 md:w-8 md:h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                 >
                   <X size={14} />
                 </button>
               )}
            </div>

            <div className="p-4 md:p-6 bg-gray-50 rounded-[24px] md:rounded-[32px] border border-gray-100 flex items-center justify-between">
               <div>
                  <p className="text-xs md:text-sm font-black text-gray-800 uppercase tracking-tighter">Status Aktif</p>
                  <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">Muncul di depan</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={isAktif} onChange={e => setIsAktif(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 md:w-11 md:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-tosca-500"></div>
               </label>
            </div>
         </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-6 md:pt-8 border-t border-gray-100">
        <button type="button" onClick={() => router.back()} className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-100 transition-all flex items-center justify-center">
          Batal
        </button>
        <button type="submit" disabled={isLoading} className={`w-full sm:w-auto px-8 py-3 md:px-12 md:py-4 rounded-xl md:rounded-2xl text-white font-black text-[10px] md:text-xs uppercase tracking-widest transition-all flex items-center justify-center shadow-lg ${themeBtn} ${isLoading ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:-translate-y-1'}`}>
          {isLoading ? 'Menerbitkan...' : 'Terbitkan Pengumuman'}
        </button>
      </div>
    </form>
  );
}

