"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { X, ImagePlus } from "lucide-react";

interface ProgramFasilitas {
  id: number;
  nama: string;
  deskripsi: string | null;
  ikon: string | null;
  url: string | null;
  unit: string;
}

interface ProgramFasilitasFormProps {
  unit: "sd" | "smp";
  initialData?: ProgramFasilitas | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProgramFasilitasForm({ unit, initialData, onSuccess, onCancel }: ProgramFasilitasFormProps) {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [ikon, setIkon] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama);
      setDeskripsi(initialData.deskripsi || "");
      setPreview(initialData.ikon);
    } else {
      setNama("");
      setDeskripsi("");
      setPreview(null);
      setIkon(null);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIkon(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let ikonUrl = initialData?.ikon || "";
      
      if (ikon) {
        const formData = new FormData();
        formData.append("file", ikon);
        formData.append("path", `program-fasilitas/${unit}`);
        const uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        ikonUrl = uploadRes.data.url;
      }

      const payload = {
        unit,
        nama,
        deskripsi,
        ikon: ikonUrl,
      };

      if (initialData) {
        await api.put(`/program-fasilitas/${initialData.id}`, payload);
        toast.success("Program & Fasilitas berhasil diperbarui!");
      } else {
        await api.post("/program-fasilitas", payload);
        toast.success("Program & Fasilitas berhasil ditambahkan!");
      }
      onSuccess();
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = error instanceof Error ? (error as any).response?.data?.message || error.message : "Gagal memproses data.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Nama Program / Fasilitas</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50 font-bold"
              placeholder="Contoh: Digital Learning..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Deskripsi Singkat</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              required
              rows={4}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50 font-medium"
              placeholder="Jelaskan secara singkat mengenai program atau fasilitas ini..."
            ></textarea>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Ikon / Gambar</label>
            <div className="relative group">
               <div className={`aspect-video rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden bg-gray-50/50 group-hover:border-tosca-500 transition-all ${preview ? 'border-solid' : ''}`}>
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6 flex flex-col items-center gap-3">
                       <ImagePlus size={40} className="text-gray-300 group-hover:text-tosca-500 transition-colors" />
                       <p className="text-xs font-bold text-gray-400">Pilih gambar atau ikon</p>
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
                  onClick={() => {setIkon(null); setPreview(null)}}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                 >
                   <X size={16} />
                 </button>
               )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-12 py-4 rounded-2xl bg-tosca-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-tosca-500/30 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:bg-tosca-600'}`}
        >
          {isLoading ? 'Sedang Memproses...' : (initialData ? 'Update Item' : 'Tambah Item')}
        </button>
      </div>
    </form>
  );
}
