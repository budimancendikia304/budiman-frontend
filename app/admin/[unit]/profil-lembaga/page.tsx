"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Building, 
  Save, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff, 
  FileText, 
  Image as ImageIcon,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import api from "@/lib/api";
import { toast } from "react-toastify";

// Helper component for expandable text (Fitur Khusus)
function ExpandableText({ text, maxLength = 40 }: { text: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text) return <span className="text-gray-400 font-bold italic">Belum diatur</span>;
  if (text.length <= maxLength) return <span className="font-semibold text-gray-700">{text}</span>;
  
  return (
    <span 
      onClick={() => setIsExpanded(!isExpanded)} 
      className="cursor-pointer font-semibold text-gray-700 hover:text-tosca-600 transition-colors block select-none"
      title="Klik untuk memperluas / meringkas teks"
    >
      {isExpanded ? text : `${text.slice(0, maxLength)}... `}
      <span className="text-[10px] text-tosca-500 font-bold uppercase underline ml-1">
        {isExpanded ? "(Ringkas)" : "(Lihat Semua)"}
      </span>
    </span>
  );
}

export default function ProfilLembagaAdminPage() {
  const params = useParams();
  const router = useRouter();
  const unit = (params?.unit as "sd" | "smp") || "sd";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [tahunBerdiri, setTahunBerdiri] = useState("2017");
  const [npsn, setNpsn] = useState("");
  const [akreditasi, setAkreditasi] = useState("A");
  const [telpAdmin, setTelpAdmin] = useState("081534648183");

  // Sejarah
  const [sejarahTeks, setSejarahTeks] = useState("");
  const [sejarahFoto, setSejarahFoto] = useState<File | null>(null);
  const [sejarahFotoPreview, setSejarahFotoPreview] = useState("");

  // Visi & Misi
  const [visi, setVisi] = useState("");
  const [misiList, setMisiList] = useState<string[]>([]);
  const [newMisiPoint, setNewMisiPoint] = useState("");

  // Statistik overrides
  const [prestasiOverride, setPrestasiOverride] = useState("");
  const [guruOverride, setGuruOverride] = useState("");
  const [siswaOverride, setSiswaOverride] = useState("");
  const [beritaOverride, setBeritaOverride] = useState("");

  // Penutup (Jadilah Bagian dari Kami)
  const [ctaTitle, setCtaTitle] = useState("Jadilah Bagian Dari Kami");
  const [ctaTelp, setCtaTelp] = useState("081534648183");
  const [ctaEmail, setCtaEmail] = useState("budimancendikia304@gmail.com");
  const [ctaAlamat, setCtaAlamat] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!unit) return;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get("/settings");
        if (res.data) {
          const s = res.data;
          
          // Header Profil
          setTahunBerdiri(s[`profil_tahun_berdiri_${unit}`] || "2017");
          setNpsn(s[`profil_npsn_${unit}`] || "");
          setAkreditasi(s[`profil_akreditasi_${unit}`] || "A");
          setTelpAdmin(s[`profil_telp_${unit}`] || "081534648183");

          // Sejarah
          setSejarahTeks(s[`profil_sejarah_teks_${unit}`] || "");
          if (s[`profil_sejarah_foto_${unit}_url`]) {
            setSejarahFotoPreview(s[`profil_sejarah_foto_${unit}_url`]);
          }

          // Visi & Misi
          setVisi(s[`profil_visi_${unit}`] || "");
          
          const savedMisi = s[`profil_misi_${unit}`];
          if (savedMisi) {
            try {
              setMisiList(JSON.parse(savedMisi));
            } catch {
              // fallback split by comma or newline if not JSON
              setMisiList(savedMisi.split("\n").filter(Boolean));
            }
          } else {
            setMisiList([]);
          }

          // Stats Overrides
          setPrestasiOverride(s[`stats_prestasi_override_${unit}`] || "");
          setGuruOverride(s[`stats_guru_override_${unit}`] || "");
          setSiswaOverride(s[`stats_siswa_override_${unit}`] || "");
          setBeritaOverride(s[`stats_berita_override_${unit}`] || "");

          // CTA / Penutup
          setCtaTitle(s[`profil_cta_title_${unit}`] || "Jadilah Bagian Dari Kami");
          setCtaTelp(s[`profil_cta_telp_${unit}`] || "081534648183");
          setCtaEmail(s[`profil_cta_email_${unit}`] || "budimancendikia304@gmail.com");
          setCtaAlamat(s[`profil_cta_alamat_${unit}`] || "");
        }
      } catch (err) {
        console.error("Gagal mengambil pengaturan profil:", err);
        toast.error("Gagal memuat pengaturan profil sekolah.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [unit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSejarahFoto(file);
      setSejarahFotoPreview(URL.createObjectURL(file));
    }
  };

  const addMisiPoint = () => {
    if (newMisiPoint.trim() === "") return;
    setMisiList([...misiList, newMisiPoint.trim()]);
    setNewMisiPoint("");
  };

  const removeMisiPoint = (index: number) => {
    setMisiList(misiList.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("unit", unit);

      // Header Profil
      formData.append(`profil_tahun_berdiri_${unit}`, tahunBerdiri);
      formData.append(`profil_npsn_${unit}`, npsn);
      formData.append(`profil_akreditasi_${unit}`, akreditasi);
      formData.append(`profil_telp_${unit}`, telpAdmin);

      // Sejarah
      formData.append(`profil_sejarah_teks_${unit}`, sejarahTeks);
      if (sejarahFoto) {
        formData.append("sejarah_foto", sejarahFoto);
      }

      // Visi & Misi
      formData.append(`profil_visi_${unit}`, visi);
      formData.append(`profil_misi_${unit}`, JSON.stringify(misiList));

      // Stats Overrides
      formData.append(`stats_prestasi_override_${unit}`, prestasiOverride);
      formData.append(`stats_guru_override_${unit}`, guruOverride);
      formData.append(`stats_siswa_override_${unit}`, siswaOverride);
      formData.append(`stats_berita_override_${unit}`, beritaOverride);

      // CTA / Penutup
      formData.append(`profil_cta_title_${unit}`, ctaTitle);
      formData.append(`profil_cta_telp_${unit}`, ctaTelp);
      formData.append(`profil_cta_email_${unit}`, ctaEmail);
      formData.append(`profil_cta_alamat_${unit}`, ctaAlamat);

      const res = await api.post("/settings/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.data?.status === "success") {
        toast.success("Profil Lembaga berhasil diperbarui!");
        router.refresh();
      } else {
        toast.error("Gagal menyimpan perubahan.");
      }
    } catch (err) {
      console.error("Gagal menyimpan profil lembaga:", err);
      toast.error("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout unit={unit} title={`Manajemen Profil Lembaga - ${unit.toUpperCase()}`}>
      <div className="max-w-6xl mx-auto py-8 px-4">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
              Manajemen Profil Lembaga
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Perbarui profil, sejarah, visi misi, statistik, dan kontak penutup unit {unit.toUpperCase()} secara terpusat.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={submitting || loading}
            className="px-6 py-3 bg-tosca-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-tosca-700 transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            <Save size={16} />
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-tosca-500 border-gray-200"></div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-10">
            
            {/* SECTION 1: HEADER PROFIL (IDENTITAS) */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Building size={20} className="text-tosca-500" />
                1. Header Profil (Identitas Lembaga)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tahun Berdiri</label>
                  <input
                    type="text"
                    value={tahunBerdiri}
                    onChange={(e) => setTahunBerdiri(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-semibold text-gray-700"
                    placeholder="Contoh: 2017"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">NPSN</label>
                  <input
                    type="text"
                    value={npsn}
                    onChange={(e) => setNpsn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-semibold text-gray-700"
                    placeholder="Nomor Pokok Sekolah Nasional"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Akreditasi</label>
                  <select
                    value={akreditasi}
                    onChange={(e) => setAkreditasi(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-semibold text-gray-700 bg-white"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="Belum Terakreditasi">Belum Terakreditasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">No. Telp Admin</label>
                  <input
                    type="text"
                    value={telpAdmin}
                    onChange={(e) => setTelpAdmin(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-semibold text-gray-700"
                    placeholder="Contoh: 081534648183"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: SEJARAH SEKOLAH */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <FileText size={20} className="text-tosca-500" />
                2. Sejarah Sekolah
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Naskah Sejarah Sekolah</label>
                  <textarea
                    rows={8}
                    value={sejarahTeks}
                    onChange={(e) => setSejarahTeks(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-medium text-gray-700 leading-relaxed"
                    placeholder="Tuliskan latar belakang dan sejarah perkembangan sekolah di sini..."
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Foto Sejarah</label>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full md:w-56 aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-tosca-500 hover:border-tosca-500 transition-all cursor-pointer bg-gray-50 overflow-hidden relative"
                    >
                      {sejarahFotoPreview ? (
                        <img src={sejarahFotoPreview} alt="Preview sejarah" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <ImageIcon size={32} className="mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-wider">Unggah Gambar</span>
                        </>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-wider text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        Pilih Berkas
                      </button>
                      <p className="text-[10px] text-gray-400 font-medium">Format yang didukung: JPG, PNG. Maksimal 2MB.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: VISI & MISI */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <CheckCircle size={20} className="text-tosca-500" />
                3. Visi & Misi
              </h2>
              <div className="space-y-8">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Visi Sekolah</label>
                  <input
                    type="text"
                    value={visi}
                    onChange={(e) => setVisi(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-bold text-gray-700"
                    placeholder="Kalimat Visi Sekolah..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Daftar Misi Sekolah</label>
                  
                  {/* Dynamic Misi List */}
                  <div className="space-y-3 mb-4">
                    {misiList.map((misi, index) => (
                      <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                        <span className="w-6 h-6 bg-tosca-100 text-tosca-700 font-black rounded-full flex items-center justify-center text-xs shrink-0">
                          {index + 1}
                        </span>
                        <span className="flex-1 font-semibold text-sm text-gray-700">{misi}</span>
                        <button
                          type="button"
                          onClick={() => removeMisiPoint(index)}
                          className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                          title="Hapus Misi"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {misiList.length === 0 && (
                      <p className="text-sm font-bold text-gray-400 italic">Belum ada poin misi sekolah.</p>
                    )}
                  </div>

                  {/* Add New Point Form */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMisiPoint}
                      onChange={(e) => setNewMisiPoint(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMisiPoint(); } }}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-semibold text-sm text-gray-700"
                      placeholder="Masukkan poin misi baru..."
                    />
                    <button
                      type="button"
                      onClick={addMisiPoint}
                      className="px-4 py-3 bg-tosca-100 text-tosca-700 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-tosca-200 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus size={16} /> Tambah
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: SINKRONISASI STATISTIK */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
                <HelpCircle size={20} className="text-tosca-500" />
                4. Sinkronisasi Angka Statistik
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-6">
                * Kosongkan kolom untuk secara otomatis menggunakan hitungan database asli (fitur sinkron otomatis). Isi angka di bawah ini untuk override / set angka kustom.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Prestasi Siswa</label>
                  <input
                    type="number"
                    value={prestasiOverride}
                    onChange={(e) => setPrestasiOverride(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-semibold text-gray-700"
                    placeholder="Hitung Otomatis DB"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Guru & Staf</label>
                  <input
                    type="number"
                    value={guruOverride}
                    onChange={(e) => setGuruOverride(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-semibold text-gray-700"
                    placeholder="Hitung Otomatis DB"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total Lulusan</label>
                  <input
                    type="number"
                    value={siswaOverride}
                    onChange={(e) => setSiswaOverride(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-semibold text-gray-700"
                    placeholder="Ketik angka lulusan..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total Berita</label>
                  <input
                    type="number"
                    value={beritaOverride}
                    onChange={(e) => setBeritaOverride(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-semibold text-gray-700"
                    placeholder="Hitung Otomatis DB"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: PENUTUP (JADILAH BAGIAN DARI KAMI) */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <ImageIcon size={20} className="text-tosca-500" />
                5. Bagian &quot;Jadilah Bagian Dari Kami&quot; (Kontak & Penutup)
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Kalimat Ajakan (CTA Title)</label>
                    <input
                      type="text"
                      value={ctaTitle}
                      onChange={(e) => setCtaTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-bold text-gray-700"
                      placeholder="Jadilah Bagian Dari Kami"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Nomor Telepon (WhatsApp Link)</label>
                    <input
                      type="text"
                      value={ctaTelp}
                      onChange={(e) => setCtaTelp(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-semibold text-gray-700"
                      placeholder="Contoh: 081534648183"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Alamat Email</label>
                    <input
                      type="email"
                      value={ctaEmail}
                      onChange={(e) => setCtaEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-semibold text-gray-700"
                      placeholder="budimancendikia304@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Pratinjau Alamat Terpotong (Klik Untuk Perluas)</label>
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs select-none">
                      <ExpandableText text={ctaAlamat || "Ketik alamat di kanan untuk melihat pratinjau..."} maxLength={40} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Lokasi / Alamat Fisik Lengkap</label>
                  <textarea
                    rows={3}
                    value={ctaAlamat}
                    onChange={(e) => setCtaAlamat(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-medium text-gray-700"
                    placeholder="Tuliskan alamat lengkap sekolah..."
                  />
                </div>
              </div>
            </div>

            {/* Save Button bottom */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting || loading}
                className="px-8 py-4 bg-tosca-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-tosca-700 transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Save size={16} />
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>

          </form>
        )}

      </div>
    </AdminLayout>
  );
}
