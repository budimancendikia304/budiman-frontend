"use client";

import { useState } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function PPDBForm({ unit }: { unit: "sd" | "smp" }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    nisn: "",
    tanggal_lahir: "",
    jenis_kelamin: "L",
    asal_sekolah: "",
    nama_ortu: "",
    no_hp: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/ppdb", { ...formData, unit });
      toast.success("Pendaftaran berhasil! Kami akan segera menghubungi Anda.");
      setFormData({
        nama_lengkap: "",
        nisn: "",
        tanggal_lahir: "",
        jenis_kelamin: "L",
        asal_sekolah: "",
        nama_ortu: "",
        no_hp: "",
        email: "",
      });
    } catch {
      toast.error("Gagal melakukan pendaftaran. Silakan cek kembali data Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
          <input
            type="text"
            name="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50"
            placeholder="Masukkan nama lengkap siswa"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">NISN</label>
          <input
            type="text"
            name="nisn"
            value={formData.nisn}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50"
            placeholder="10 digit NISN (Opsional)"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tanggal Lahir</label>
          <input
            type="date"
            name="tanggal_lahir"
            value={formData.tanggal_lahir}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Jenis Kelamin</label>
          <select
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50 appearance-none"
          >
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Asal Sekolah</label>
          <input
            type="text"
            name="asal_sekolah"
            value={formData.asal_sekolah}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50"
            placeholder="Contoh: TK Abata / SD Negeri 01"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nama Orang Tua / Wali</label>
          <input
            type="text"
            name="nama_ortu"
            value={formData.nama_ortu}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50"
            placeholder="Nama ayah atau ibu"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nomor HP (WhatsApp)</label>
          <input
            type="tel"
            name="no_hp"
            value={formData.no_hp}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50"
            placeholder="0812xxxxxxxx"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50"
            placeholder="contoh@email.com"
          />
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 px-8 rounded-2xl bg-tosca-500 hover:bg-tosca-700 text-white font-black tracking-widest uppercase transition-all shadow-lg shadow-tosca-500/30 disabled:opacity-70 disabled:scale-95 hover:-translate-y-1"
        >
          {isLoading ? "Mengirim Data..." : "Kirim Pendaftaran Online"}
        </button>
      </div>
    </form>
  );
}
