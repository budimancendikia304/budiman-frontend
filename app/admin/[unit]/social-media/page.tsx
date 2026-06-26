"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { Instagram, Share2 } from "lucide-react";

export default function AdminSocialMediaEdit() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Single unified form state
  const [formData, setFormData] = useState({
    instagram_title: "",
    instagram_description: "",
    instagram_url: "",
    instagram_username: "",
    tiktok_url: "",
    whatsapp_number: "",
  });

  useEffect(() => {
    if (!unit) return;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get("/settings");
        if (res.data) {
          setFormData({
            instagram_title: res.data.instagram_title || "",
            instagram_description: res.data.instagram_description || "",
            instagram_url: res.data.instagram_url || "",
            instagram_username: res.data.instagram_username || "",
            tiktok_url: res.data.tiktok_url || "",
            whatsapp_number: res.data.whatsapp_number || "",
          });
        }
      } catch (err) {
        console.error("Gagal memuat pengaturan sosial media:", err);
        toast.error("Gagal memuat pengaturan sosial media.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [unit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const res = await api.post("/settings/update", formData);
      toast.success("Pengaturan Sosial Media berhasil diperbarui!");
      if (res.data?.data) {
        setFormData({
          instagram_title: res.data.data.instagram_title || "",
          instagram_description: res.data.data.instagram_description || "",
          instagram_url: res.data.data.instagram_url || "",
          instagram_username: res.data.data.instagram_username || "",
          tiktok_url: res.data.data.tiktok_url || "",
          whatsapp_number: res.data.data.whatsapp_number || "",
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal memperbarui pengaturan sosial media.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout unit={unit} title="Pengaturan Sosial Media">
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-tosca-500 border-gray-200"></div>
        </div>
      ) : (
        <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center py-6 max-w-6xl mx-auto">
          
          {/* Main Title Section */}
          <div className="mb-8">
            <span className="text-tosca-600 font-bold uppercase tracking-widest text-[10px]">Panel Admin</span>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-1">Pengaturan Sosial Media</h1>
            <p className="text-xs text-gray-400 font-medium mt-1">Kelola akun Instagram, TikTok, dan nomor WhatsApp resmi sekolah.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Grid for Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Card 1: Instagram */}
              <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col h-full transition-all duration-300 hover:shadow-md">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600">
                    <Instagram size={24} />
                  </div>
                  <div>
                    <span className="text-pink-600 font-bold uppercase tracking-widest text-[9px]">Media Utama</span>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none mt-1">Instagram</h2>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Instagram size={14} className="text-gray-400" />
                      Judul Instagram
                    </label>
                    <input
                      type="text"
                      value={formData.instagram_title}
                      onChange={(e) => setFormData({ ...formData, instagram_title: e.target.value })}
                      placeholder="Yuk, Kepoin Keseruan Kami di Instagram"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-tosca-500 transition-all font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Instagram size={14} className="text-gray-400" />
                      Deskripsi Instagram
                    </label>
                    <textarea
                      value={formData.instagram_description}
                      onChange={(e) => setFormData({ ...formData, instagram_description: e.target.value })}
                      rows={4}
                      placeholder="Mulai dari keseruan belajar di kelas..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-tosca-500 transition-all font-medium leading-relaxed"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Instagram size={14} className="text-gray-400" />
                      Link Profil Instagram
                    </label>
                    <input
                      type="url"
                      value={formData.instagram_url}
                      onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                      placeholder="https://www.instagram.com/username"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-tosca-500 transition-all font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Instagram size={14} className="text-gray-400" />
                      Username Instagram
                    </label>
                    <input
                      type="text"
                      value={formData.instagram_username}
                      onChange={(e) => setFormData({ ...formData, instagram_username: e.target.value })}
                      placeholder="username"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-tosca-500 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

              </div>

              {/* Card 2: Kontak & Media Lainnya */}
              <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col h-full transition-all duration-300 hover:shadow-md">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-tosca-50 rounded-xl flex items-center justify-center text-tosca-600">
                    <Share2 size={24} />
                  </div>
                  <div>
                    <span className="text-tosca-600 font-bold uppercase tracking-widest text-[9px]">Media Sosial & Kontak</span>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none mt-1">Kontak & Media Lainnya</h2>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="text-gray-400">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.74-3.99-1.66-.22-.17-.41-.36-.6-.56v7.13c-.02 2.63-.99 5.13-2.92 6.84-2.14 1.89-5.19 2.58-7.99 1.81-2.92-.77-5.34-3.13-6.07-6.07-.9-3.41.25-7.23 2.99-9.37 1.95-1.54 4.54-2.14 7-1.63v4.05c-.86-.18-1.78-.11-2.58.26-.81.36-1.48.99-1.86 1.78-.63 1.26-.41 2.92.56 3.94.97 1.02 2.52 1.25 3.73.57.77-.43 1.22-1.22 1.23-2.1V.02z"/>
                      </svg>
                      Link Profil TikTok
                    </label>
                    <input
                      type="url"
                      value={formData.tiktok_url}
                      onChange={(e) => setFormData({ ...formData, tiktok_url: e.target.value })}
                      placeholder="https://www.tiktok.com/@username"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-tosca-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="text-gray-400">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.419 5.422.002 12.005.002c3.192.001 6.192 1.244 8.448 3.501 2.256 2.257 3.497 5.257 3.495 8.45-.004 6.581-5.424 11.998-12.008 11.998-2.005-.002-3.98-.507-5.73-1.472L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.449 5.49 0 9.957-4.467 9.96-9.96.002-2.661-1.034-5.163-2.915-7.046C16.48 1.714 13.98.674 11.32.674 5.828.674 1.36 5.14 1.358 10.63c-.001 1.704.476 3.238 1.387 4.678l-.993 3.626 3.71-.973.505.293zm9.055-6.72c-.243-.122-1.434-.708-1.656-.79-.22-.082-.38-.122-.54.122-.16.244-.622.79-.762.948-.14.158-.28.178-.522.057a7.279 7.279 0 0 1-3.233-1.993c-.886-.788-1.485-1.761-1.66-2.066-.173-.306-.018-.472.133-.623.136-.137.304-.35.457-.525.152-.174.203-.298.304-.497.102-.2.05-.374-.025-.522-.076-.148-.622-1.503-.852-2.057-.225-.54-.472-.466-.648-.475-.168-.008-.36-.01-.552-.01-.192 0-.505.072-.77.36-.264.288-1.01.986-1.01 2.404s1.03 2.788 1.173 2.98c.143.195 2.025 3.093 4.908 4.336.685.296 1.22.473 1.637.605.69.22 1.32.19 1.816.116.553-.082 1.434-.586 1.637-1.155.203-.57.203-1.057.142-1.155-.06-.1-.22-.158-.463-.28z"/>
                      </svg>
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      pattern="[0-9+]*"
                      value={formData.whatsapp_number}
                      onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                      placeholder="6281534648183"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-tosca-500 transition-all font-medium"
                      required
                    />
                    <span className="text-[10px] text-gray-400 font-bold block mt-1">Masukkan angka saja (contoh: 6281534648183).</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Submit Action Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full max-w-md py-4 bg-tosca-600 hover:bg-tosca-700 disabled:opacity-50 text-white font-black rounded-2xl text-xs tracking-widest uppercase transition-all shadow-lg shadow-tosca-500/20 cursor-pointer text-center"
              >
                {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>

          </form>
        </div>
      )}
    </AdminLayout>
  );
}
