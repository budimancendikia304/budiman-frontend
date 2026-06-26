"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ImagePlus, Trophy, Undo2, X, UploadCloud } from "lucide-react";

export default function PrestasiForm({ unit, initialData }: { unit: "sd" | "smp", initialData?: any }) {
  const router = useRouter();
  const [judul, setJudul] = useState(initialData?.judul || "");
  const [konten, setKonten] = useState(initialData?.konten || "");
  const [tanggal, setTanggal] = useState(initialData?.tanggal || "");
  const [kategori, setKategori] = useState(initialData?.kategori || "siswa");
  const [tingkat, setTingkat] = useState(initialData?.tingkat || "Lokal");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData?.image || null);
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

    if (!judul.trim()) {
      toast.error("Judul prestasi wajib diisi.");
      return;
    }
    if (!tanggal) {
      toast.error("Tanggal perolehan wajib diisi.");
      return;
    }
    if (!kategori) {
      toast.error("Kategori wajib diisi.");
      return;
    }
    if (!tingkat) {
      toast.error("Tingkat prestasi wajib diisi.");
      return;
    }
    if (!konten.trim()) {
      toast.error("Keterangan/detail prestasi wajib diisi.");
      return;
    }
    if (!image && !initialData) {
      toast.error("Foto dokumentasi wajib diunggah.");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = preview;
      if (image) {
        const uploadData = new FormData();
        uploadData.append("file", image);
        uploadData.append("path", `prestasi/${unit}`);
        const uploadRes = await api.post("/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        imageUrl = uploadRes.data.url;
      }

      const payload = {
        unit,
        judul,
        konten,
        tanggal,
        kategori,
        tingkat,
        image: imageUrl,
      };

      if (initialData) {
        await api.put(`/prestasi/${initialData.id}`, payload);
        toast.success("Prestasi berhasil diperbarui!");
      } else {
        await api.post("/prestasi", payload);
        toast.success("Prestasi berhasil dicatat!");
      }
      router.push(`/admin/${unit}/prestasi`);
    } catch (err: any) {
      console.error(err);
      toast.error(initialData ? "Gagal memperbarui data prestasi." : "Gagal menyimpan data prestasi.");
    } finally {
      setIsLoading(false);
    }
  };

  const themeBtn = unit === "sd" ? "bg-tosca-500 hover:bg-tosca-700 shadow-tosca-500/30" : "bg-tosca-700 hover:bg-tosca-900 shadow-tosca-700/30";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="space-y-6">
            <div>
               <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Judul Prestasi</label>
               <input type="text" value={judul} onChange={e => setJudul(e.target.value)} required className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 outline-none font-bold" placeholder="Contoh: Juara 1 OSN Matematika" />
            </div>
            <div>
               <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tanggal Perolehan</label>
               <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} required className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Kategori</label>
                 <select value={kategori} onChange={e => setKategori(e.target.value)} className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 outline-none appearance-none cursor-pointer">
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru</option>
                    <option value="sekolah">Sekolah</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tingkat</label>
                 <select value={tingkat} onChange={e => setTingkat(e.target.value)} className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 outline-none appearance-none cursor-pointer">
                    <option value="Lokal">Lokal</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Internasional">Internasional</option>
                 </select>
              </div>
            </div>
            <div>
               <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Keterangan / Detail</label>
               <textarea value={konten} onChange={e => setKonten(e.target.value)} rows={5} required className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 outline-none" placeholder="Jelaskan detail prestasi yang diraih..."></textarea>
            </div>
         </div>

         <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Foto Dokumentasi</label>
            <div className="relative aspect-[4/3] rounded-[32px] border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center group hover:border-tosca-500 transition-all">
               {preview ? (
                 <img src={preview} alt="Preview" className="w-full h-full object-cover" />
               ) : (
                 <div className="text-center p-6 flex flex-col items-center gap-3">
                    <ImagePlus size={40} className="text-gray-300 group-hover:text-tosca-500 transition-colors" />
                    <p className="text-xs font-bold text-gray-400">Pilih foto prestasi</p>
                 </div>
               )}
               <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            </div>
            {preview && (
              <button 
               type="button" 
               onClick={() => {setImage(null); setPreview(null)}}
               className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
              >
                <X size={16} />
              </button>
            )}
         </div>
      </div>

      <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
        <button type="button" onClick={() => router.back()} className="px-8 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-100 transition-all flex items-center justify-center">
          Batal
        </button>
        <button type="submit" disabled={isLoading} className={`px-12 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center shadow-lg ${themeBtn} ${isLoading ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:-translate-y-1'}`}>
          {isLoading ? 'Menyimpan...' : initialData ? 'Perbarui Prestasi' : 'Simpan Prestasi'}
        </button>
      </div>
    </form>
  );
}

