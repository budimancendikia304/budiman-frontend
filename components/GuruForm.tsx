"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { UserCircle, Save, Undo2, X, UploadCloud, UserPlus } from "lucide-react";

interface GuruData {
  id?: number;
  nama: string;
  nip?: string;
  jabatan: string;
  mata_pelajaran?: string;
  email?: string;
  gmail?: string;
  whatsapp?: string;
  foto?: string;
}

export default function GuruForm({ unit, initialData }: { unit: "sd" | "smp", initialData?: GuruData }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: initialData?.nama || "",
    nip: initialData?.nip || "",
    jabatan: initialData?.jabatan || "",
    mata_pelajaran: initialData?.mata_pelajaran || "",
    email: initialData?.email || "",
    gmail: initialData?.gmail || "",
    whatsapp: initialData?.whatsapp || "",
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData?.foto || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let fotoUrl = preview;
      if (foto) {
        const uploadData = new FormData();
        uploadData.append("file", foto);
        uploadData.append("path", `guru/${unit}`);
        const uploadRes = await api.post("/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        fotoUrl = uploadRes.data.url;
      }

      const payload = { ...formData, unit, foto: fotoUrl };
      if (initialData) {
        await api.put(`/guru/${initialData.id}`, payload);
        toast.success("Data guru berhasil diperbarui!");
      } else {
        await api.post("/guru", payload);
        toast.success("Guru berhasil ditambahkan!");
      }
      router.push(`/admin/${unit}/guru`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? (error as any).response?.data?.message || error.message : "Gagal menyimpan data guru.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const themeBtn = unit === "sd" ? "bg-tosca-500 hover:bg-tosca-700 shadow-tosca-500/30" : "bg-tosca-700 hover:bg-tosca-900 shadow-tosca-700/30";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Foto Profil (3:4)</label>
          <div className="relative group mx-auto w-48 h-64">
            <div className="w-full h-full rounded-[32px] border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center group-hover:border-tosca-500 transition-all">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 flex flex-col items-center gap-2">
                   <UserCircle size={48} className="text-gray-300 group-hover:text-tosca-500 transition-colors" />
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Upload Foto</p>
                </div>
              )}
              <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            </div>
            {preview && (
              <button type="button" onClick={() => {setFoto(null); setPreview(null)}} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
            <input type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 outline-none font-bold" placeholder="Contoh: Budi Santoso, S.Pd" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">NIP / NUPTK</label>
            <input type="text" value={formData.nip} onChange={e => setFormData({...formData, nip: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 outline-none" placeholder="Opsional" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Jabatan</label>
            <input type="text" value={formData.jabatan} onChange={e => setFormData({...formData, jabatan: e.target.value})} required className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 outline-none" placeholder="Contoh: Wali Kelas 1A" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mata Pelajaran</label>
            <input type="text" value={formData.mata_pelajaran} onChange={e => setFormData({...formData, mata_pelajaran: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 outline-none" placeholder="Contoh: Matematika" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email (Cadangan)</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 outline-none" placeholder="guru@sekolah.com" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Gmail Aktif</label>
            <input type="email" value={formData.gmail} onChange={e => setFormData({...formData, gmail: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 outline-none font-bold" placeholder="nama.guru@gmail.com" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">WhatsApp (62...)</label>
            <input type="text" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 outline-none font-bold" placeholder="628123456789" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
        <button type="button" onClick={() => router.back()} className="px-8 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-100 transition-all flex items-center justify-center">
          Batal
        </button>
        <button type="submit" disabled={isLoading} className={`px-12 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center shadow-lg ${themeBtn} ${isLoading ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:-translate-y-1'}`}>
          {isLoading ? 'Menyimpan...' : initialData ? 'Perbarui Data' : 'Tambah Guru'}
        </button>
      </div>
    </form>
  );
}

