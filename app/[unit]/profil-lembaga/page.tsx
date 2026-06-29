"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Calendar, 
  Award, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Trophy, 
  Newspaper, 
  GraduationCap, 
  Eye, 
  Target, 
  ChevronRight, 
  ChevronDown,
  Quote 
} from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/imageHelper";
import { SITE_STATS } from "@/lib/constants";

interface ProgramItem {
  id: number;
  nama: string;
  deskripsi: string;
  ikon: string | null;
  slug: string;
}

interface Guru {
  id: number;
  nama: string;
  jabatan: string;
  mata_pelajaran: string | null;
  foto: string | null;
  gmail: string | null;
  whatsapp: string | null;
}

// Click-to-expand text component (Fitur Khusus)
function ExpandableText({ text, maxLength = 60 }: { text: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text) return null;
  if (text.length <= maxLength) return <span>{text}</span>;
  
  return (
    <span 
      onClick={() => setIsExpanded(!isExpanded)} 
      className="cursor-pointer hover:text-tosca-300 transition-colors select-none"
      title="Klik untuk melihat lengkap / ringkas"
    >
      {isExpanded ? text : `${text.slice(0, maxLength)}... `}
      <span className="text-[10px] text-tosca-300 underline font-black ml-1 uppercase">
        {isExpanded ? "(Ringkas)" : "(Selengkapnya)"}
      </span>
    </span>
  );
}

export default function ProfilLembagaPage() {
  const params = useParams();
  const unit = (params?.unit as "sd" | "smp") || "sd";

  // Helper to format WhatsApp number to international format starting with 62
  const formatWhatsApp = (num: string | null) => {
    if (!num) return "";
    const cleanNum = num.replace(/\D/g, "");
    if (cleanNum.startsWith("0")) {
      return "62" + cleanNum.slice(1);
    }
    if (cleanNum.startsWith("62")) {
      return cleanNum;
    }
    return "62" + cleanNum;
  };

  // Helper to format phone number for display
  const formatPhoneDisplay = (num: string | null) => {
    if (!num) return "";
    const cleanNum = num.replace(/\D/g, "");
    if (cleanNum.length === 12 && cleanNum.startsWith("0")) {
      return `${cleanNum.slice(0, 4)}-${cleanNum.slice(4, 8)}-${cleanNum.slice(8)}`;
    }
    if (cleanNum.length === 11 && !cleanNum.startsWith("0")) {
      return `0${cleanNum.slice(0, 3)}-${cleanNum.slice(3, 7)}-${cleanNum.slice(7)}`;
    }
    if (cleanNum.length === 13 && cleanNum.startsWith("62")) {
      return `0${cleanNum.slice(2, 5)}-${cleanNum.slice(5, 9)}-${cleanNum.slice(9)}`;
    }
    return num;
  };

  interface Headmaster {
    name: string;
    greeting: string;
    photo: string | null;
  }

  const [stats, setStats] = useState(SITE_STATS[unit]);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [headmaster, setHeadmaster] = useState<Headmaster | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSambutanExpanded, setIsSambutanExpanded] = useState(false);

  // Dynamic States from settings DB
  const [tahunBerdiri, setTahunBerdiri] = useState("2017");
  const [npsn, setNpsn] = useState(unit === "sd" ? "69972322" : "69972323");
  const [akreditasi, setAkreditasi] = useState("A");
  const [telpAdmin, setTelpAdmin] = useState("081534648183");

  const [sejarahTeks, setSejarahTeks] = useState("");
  const [sejarahFotoUrl, setSejarahFotoUrl] = useState("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800");

  const [visi, setVisi] = useState("");
  const [misiList, setMisiList] = useState<string[]>([]);

  const [ctaTitle, setCtaTitle] = useState("Jadilah Bagian Dari Kami");
  const [ctaTelp, setCtaTelp] = useState("081534648183");
  const [ctaEmail, setCtaEmail] = useState("budimancendikia304@gmail.com");
  const [ctaAlamat, setCtaAlamat] = useState("Jalan Alumunium III No. 79, Tanjung Mulia, Kecamatan Medan Deli, Kota Medan, Sumatera Utara 20241");

  // Fallbacks / Defaults
  const schoolName = unit === "sd" ? "SD Budiman Cendikia Medan" : "SMP Budiman Cendekia Medan";

  const defaultSejarah = {
    sd: "Sekolah Dasar (SD) Budiman Cendikia didirikan pada tahun 2017 di bawah naungan Yayasan Pendidikan Budiman Cendikia. Didirikan dengan visi untuk memberikan pendidikan dasar berkualitas tinggi yang mengintegrasikan kecerdasan intelektual dengan pembentukan karakter Islami yang kuat. Sejak awal berdirinya, sekolah ini terus berkomitmen meningkatkan kualitas mutu pengajaran melalui pengembangan kurikulum berbasis karakter dan penerapan teknologi digital ramah anak demi mendidik siswa yang unggul di era global.",
    smp: "Sekolah Menengah Pertama (SMP) Budiman Cendikia Medan didirikan pada tahun 2017 untuk melanjutkan misi mulia pendidikan berkualitas tinggi bagi generasi muda di Medan Deli dan sekitarnya. Dengan memadukan kurikulum nasional dan nilai-nilai keagamaan, SMP Budiman Cendikia mendampingi para siswa melewati fase remaja dengan bimbingan akhlakul karimah, kemandirian belajar, keunggulan akademis, serta penguasaan teknologi informasi."
  }[unit];

  const defaultVisiMisi = {
    sd: {
      visi: "Menjadi Sekolah Dasar unggulan yang mencetak generasi cerdas, mandiri, kreatif, dan berakhlak mulia berlandaskan nilai-nilai Islami.",
      misi: [
        "Menyelenggarakan pendidikan dasar yang mengintegrasikan kurikulum nasional dengan nilai-nilai spiritual keagamaan.",
        "Mengembangkan potensi bakat, minat, dan kreativitas siswa secara optimal melalui bimbingan berkelanjutan.",
        "Membiasakan budaya mandiri, disiplin, berakhlak mulia, dan peduli sosial di lingkungan sekolah.",
        "Mewujudkan lingkungan belajar ramah anak yang aman, nyaman, dan edukatif."
      ]
    },
    smp: {
      visi: "Mewujudkan generasi muda tingkat menengah yang unggul dalam ilmu pengetahuan, teknologi, mandiri, berkarakter mulia, serta teguh dalam keimanan dan ketaqwaan.",
      misi: [
        "Menyelenggarakan pendidikan menengah yang seimbang antara keunggulan akademis dan penguatan moral keagamaan.",
        "Mendorong kebiasaan belajar mandiri, bernalar kritis, dan penguasaan teknologi digital secara produktif.",
        "Membina kepribadian yang berbudi pekerti luhur, berintegritas tinggi, dan cinta tanah air.",
        "Menyediakan fasilitas pendukung pembelajaran yang modern, aman, serta kondusif bagi pengembangan minat siswa."
      ]
    }
  }[unit];

  const defaultHeadmaster = {
    sd: {
      name: "Dr. H. Ahmad Fauzi, M.Pd",
      greeting: "Pendidikan dasar adalah fondasi utama dalam pembentukan karakter anak. Di SD Budiman Cendikia, kami mengintegrasikan kecerdasan akademis dengan penanaman budi pekerti luhur dan nilai-nilai keislaman sejak usia dini.",
    },
    smp: {
      name: "Drs. H. Mulyadi, M.Si",
      greeting: "Melalui proses pembelajaran yang mandiri, kreatif, dan berbasis teknologi informasi, kami membimbing siswa SMP Budiman Cendikia menjadi generasi unggul yang siap berkontribusi positif bagi masyarakat.",
    }
  }[unit];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch settings
        const settingsRes = await api.get("/settings");
        if (settingsRes.data) {
          const s = settingsRes.data;

          // Header
          setTahunBerdiri(s[`profil_tahun_berdiri_${unit}`] || "2017");
          setNpsn(s[`profil_npsn_${unit}`] || (unit === "sd" ? "69972322" : "69972323"));
          setAkreditasi(s[`profil_akreditasi_${unit}`] || "A");
          setTelpAdmin(s[`profil_telp_${unit}`] || "081534648183");

          // Sejarah
          setSejarahTeks(s[`profil_sejarah_teks_${unit}`] || defaultSejarah);
          if (s[`profil_sejarah_foto_${unit}_url`]) {
            setSejarahFotoUrl(s[`profil_sejarah_foto_${unit}_url`]);
          }

          // Visi Misi
          setVisi(s[`profil_visi_${unit}`] || defaultVisiMisi.visi);
          
          const savedMisi = s[`profil_misi_${unit}`];
          if (savedMisi) {
            try {
              setMisiList(JSON.parse(savedMisi));
            } catch {
              setMisiList(savedMisi.split("\n").filter(Boolean));
            }
          } else {
            setMisiList(defaultVisiMisi.misi);
          }

          // CTA
          setCtaTitle(s[`profil_cta_title_${unit}`] || "Jadilah Bagian Dari Kami");
          setCtaTelp(s[`profil_cta_telp_${unit}`] || "081534648183");
          setCtaEmail(s[`profil_cta_email_${unit}`] || "budimancendikia304@gmail.com");
          setCtaAlamat(s[`profil_cta_alamat_${unit}`] || "Jalan Alumunium III No. 79, Tanjung Mulia, Kecamatan Medan Deli, Kota Medan, Sumatera Utara 20241");
        }

        // Fetch stats
        const statsRes = await api.get(`/stats?unit=${unit}`);
        if (statsRes.data) {
          setStats({
            ...SITE_STATS[unit],
            prestasi: statsRes.data.data?.prestasi ?? statsRes.data.prestasi ?? statsRes.data.prestasi_count ?? SITE_STATS[unit].prestasi,
            guru: statsRes.data.data?.guru ?? statsRes.data.guru ?? statsRes.data.guru_count ?? SITE_STATS[unit].guru,
            berita: statsRes.data.data?.berita ?? statsRes.data.berita ?? statsRes.data.berita_count ?? SITE_STATS[unit].berita,
            siswa: statsRes.data.data?.siswa ?? statsRes.data.siswa ?? statsRes.data.siswa_count ?? SITE_STATS[unit].siswa,
          });
        }

        // Fetch headmaster
        try {
          const hmRes = await api.get(`/headmaster?unit=${unit}`);
          if (hmRes.data) {
            setHeadmaster(hmRes.data);
          }
        } catch (err) {
          console.error("Gagal memuat data kepala sekolah:", err);
        }
      } catch (err) {
        console.error("Gagal memuat profil lembaga:", err);
      }

      try {
        // Fetch programs
        const progRes = await api.get(`/program-fasilitas?unit=${unit}`);
        if (progRes.data) {
          setPrograms(progRes.data);
        }
      } catch (err) {
        console.error("Gagal memuat program sekolah:", err);
      }

      try {
        // Fetch teachers
        const guruRes = await api.get(`/guru?unit=${unit}`);
        if (guruRes.data) {
          setGuruList(guruRes.data);
        }
      } catch (err) {
        console.error("Gagal memuat data pengajar:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [unit]);

  const kepalaSekolah = guruList.length > 0 ? guruList[0] : null;
  const previewGuru = guruList.length > 1 ? guruList.slice(1, 5) : [];

  const activeGreeting = headmaster?.greeting || defaultHeadmaster.greeting;
  const paragraphs = activeGreeting
    .replace(/\r/g, "")
    .split(/\n+/)
    .filter(Boolean);

  return (
    <PublicLayout unit={unit}>
      <style dangerouslySetInnerHTML={{__html: `
        .profile-sambutan-container {
          max-height: 180px !important;
          overflow: hidden !important;
          position: relative !important;
          transition: max-height 0.8s ease-in-out !important;
          margin-bottom: 15px !important;
        }
        .profile-sambutan-container.open {
          max-height: 3000px !important;
        }
        .profile-sambutan-container::after {
          content: "" !important;
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100px !important;
          pointer-events: none !important;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.25) 25%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0.75) 75%,
            rgba(255, 255, 255, 1) 100%
          ) !important;
          opacity: 1 !important;
          transition: opacity 0.8s ease-in-out !important;
        }
        .profile-sambutan-container.open::after {
          opacity: 0 !important;
        }
      `}} />
      <div className="bg-white min-h-screen text-gray-800">
        
        {/* BREADCRUMB */}
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tosca-500">
            <Link href={`/${unit}`} className="hover:text-tosca-700 transition-colors">
              Beranda
            </Link>
            <ChevronRight size={12} className="text-tosca-200" />
            <span className="text-tosca-400">Profil Sekolah</span>
            <ChevronRight size={12} className="text-tosca-200" />
            <span className="text-tosca-700">Profil Lembaga</span>
          </nav>
        </div>

        {/* HEADER SECTION (Hero Identitas) */}
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <div className="relative rounded-[40px] overflow-hidden p-8 md:p-14 text-white shadow-xl" style={{ background: "var(--bg-aksen-kokoh)" }}>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none"></div>
            <div className="relative z-10 max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-white/20">
                PROFIL RESMI
              </span>
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight uppercase leading-none">
                Profil Lembaga
              </h1>
              <p className="text-base md:text-lg font-medium text-white/80 mb-10 leading-relaxed">
                Mengenal lebih dekat {schoolName}, lembaga pendidikan berkualitas tinggi yang berkomitmen mencetak generasi cerdas, mandiri, kreatif, dan berakhlak mulia.
              </p>
            </div>

            {/* Identitas Grid */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-8 border-t border-white/10">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-inner">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-1">Tahun Berdiri</span>
                <span className="text-xl md:text-2xl font-black">{tahunBerdiri}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-inner">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-1">NPSN</span>
                <span className="text-xl md:text-2xl font-black">{npsn}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-inner">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-1">Akreditasi</span>
                <span className="text-xl md:text-2xl font-black">Peringkat &quot;{akreditasi}&quot;</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-inner">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-1">No. Telp Admin</span>
                <span className="text-sm md:text-base font-black truncate block mt-1">{formatPhoneDisplay(telpAdmin)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* SEJARAH SECTION */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Teks Sejarah */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-tosca-50 text-tosca-700 rounded-full text-xs font-black uppercase tracking-widest border border-tosca-100">
                Latar Belakang
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-tosca-900 tracking-tight leading-none uppercase">
                Sejarah {schoolName}
              </h2>
              <div className="h-1.5 w-20 bg-tosca-500 rounded-full"></div>
              <div className="text-gray-600 font-medium leading-relaxed text-justify md:text-left whitespace-pre-line">
                {sejarahTeks}
              </div>
            </div>
            {/* Foto Sejarah */}
            <div className="flex justify-center">
              <div className="relative group w-full max-w-md aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 bg-tosca-50">
                <img 
                  src={sejarahFotoUrl} 
                  alt={`Gedung Sekolah ${schoolName}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tosca-950/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* VISI & MISI SECTION */}
        <section className="bg-tosca-50/50 py-20 mb-20 border-y border-tosca-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-white text-tosca-700 rounded-full text-xs font-black uppercase tracking-widest border border-tosca-200 shadow-sm mb-4">
                Pilar Pendidikan
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-tosca-900 uppercase tracking-tight">
                Visi & Misi Sekolah
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* VISI CARD */}
              <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-lg border border-gray-100 flex flex-col relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-tosca-100 rounded-full opacity-30 group-hover:scale-110 transition-transform"></div>
                <div className="w-14 h-14 bg-tosca-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md shadow-tosca-500/20">
                  <Target size={28} />
                </div>
                <h3 className="text-2xl font-black text-tosca-900 uppercase mb-4 tracking-tight">Visi</h3>
                <p className="text-gray-600 font-bold text-lg md:text-xl leading-relaxed italic">
                  &quot;{visi}&quot;
                </p>
              </div>

              {/* MISI CARD */}
              <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-lg border border-gray-100 flex flex-col group hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-tosca-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-tosca-500/20">
                    <Eye size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-tosca-900 uppercase tracking-tight">Misi</h3>
                </div>
                <ul className="space-y-4 flex-1">
                  {misiList.map((item, index) => (
                    <li key={index} className="flex gap-4 items-start text-gray-600 font-medium">
                      <span className="w-6 h-6 bg-tosca-50 text-tosca-600 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 border border-tosca-100">
                        {index + 1}
                      </span>
                      <p className="leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* STATISTIK SECTION */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div 
            className="w-full rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0FA8A4 0%, #0B6B69 100%)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none rounded-3xl"></div>
            
            {/* Stat Item 1 */}
            <div className="flex flex-col items-center text-center p-4 w-full md:w-1/4">
              <div className="w-10 h-10 bg-white/10 border border-white/20 text-white rounded-xl flex items-center justify-center mb-3">
                <Trophy size={20} />
              </div>
              <span className="text-3xl md:text-4xl font-black text-white mb-1">
                {stats.prestasi}+
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                Prestasi Siswa
              </span>
            </div>

            {/* Divider */}
            <div className="hidden md:block h-16 w-[1px] bg-white/10"></div>

            {/* Stat Item 2 */}
            <div className="flex flex-col items-center text-center p-4 w-full md:w-1/4">
              <div className="w-10 h-10 bg-white/10 border border-white/20 text-white rounded-xl flex items-center justify-center mb-3">
                <Users size={20} />
              </div>
              <span className="text-3xl md:text-4xl font-black text-white mb-1">
                {stats.guru ?? 0}+
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                Guru & Staf
              </span>
            </div>

            {/* Divider */}
            <div className="hidden md:block h-16 w-[1px] bg-white/10"></div>

            {/* Stat Item 3 */}
            <div className="flex flex-col items-center text-center p-4 w-full md:w-1/4">
              <div className="w-10 h-10 bg-white/10 border border-white/20 text-white rounded-xl flex items-center justify-center mb-3">
                <GraduationCap size={20} />
              </div>
              <span className="text-3xl md:text-4xl font-black text-white mb-1">
                {stats.siswa ?? 0}+
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                Total Lulusan
              </span>
            </div>

            {/* Divider */}
            <div className="hidden md:block h-16 w-[1px] bg-white/10"></div>

            {/* Stat Item 4 */}
            <div className="flex flex-col items-center text-center p-4 w-full md:w-1/4">
              <div className="w-10 h-10 bg-white/10 border border-white/20 text-white rounded-xl flex items-center justify-center mb-3">
                <Newspaper size={20} />
              </div>
              <span className="text-3xl md:text-4xl font-black text-white mb-1">
                {stats.berita ?? 0}+
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                Total Berita
              </span>
            </div>
          </div>
        </section>

        {/* PROGRAM PENDIDIKAN SECTION */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-tosca-50 text-tosca-700 rounded-full text-xs font-black uppercase tracking-widest border border-tosca-100 mb-4">
              Kurikulum Unggulan
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-tosca-900 uppercase tracking-tight">
              Program Pendidikan
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-tosca-500 border-gray-200"></div>
            </div>
          ) : programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {programs.slice(0, 3).map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl hover:border-tosca-200 transition-all duration-300">
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-tosca-50 mb-6 relative">
                    <img 
                      src={getImageUrl(item.ikon)} 
                      alt={item.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <h3 className="text-xl font-black text-tosca-900 mb-3 uppercase tracking-tight group-hover:text-tosca-500 transition-colors">
                    {item.nama}
                  </h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed flex-1 line-clamp-3">
                    {item.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 font-bold p-12">Belum ada program pendidikan yang diunggah.</p>
          )}

          <div className="text-center mt-8">
            <Link 
              href={`/${unit}/fasilitas`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-tosca-500 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-tosca-600 transition-all hover:scale-105 shadow-md shadow-tosca-500/20"
            >
              <span>Lihat Selengkapnya</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>

        {/* TENAGA PENDIDIK SECTION */}
        <section className="bg-tosca-50/30 py-20 border-y border-tosca-100 mb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-white text-tosca-700 rounded-full text-xs font-black uppercase tracking-widest border border-tosca-200 shadow-sm mb-4">
                Dewan Guru & Staf
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-tosca-900 uppercase tracking-tight">
                Tenaga Pendidik Kami
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-tosca-500 border-gray-200"></div>
              </div>
            ) : (
              <div className="space-y-12">
                
                 {/* Kepala Sekolah Card */}
                 {headmaster ? (
                   <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500 max-w-4xl mx-auto">
                     <div className="w-full md:w-[320px] bg-tosca-50 flex-shrink-0 overflow-hidden aspect-[3/4]">
                       <img 
                         src={headmaster.photo ? getImageUrl(headmaster.photo) : `https://ui-avatars.com/api/?name=${encodeURIComponent(headmaster.name)}&background=2FCFC9&color=fff&size=512`}
                         alt={headmaster.name} 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                       />
                     </div>
                     <div className="p-8 md:p-12 flex flex-col justify-center flex-1 relative">
                       <div className="absolute top-0 right-0 p-8 opacity-5 text-tosca-900 pointer-events-none transform -rotate-12">
                         <Quote size={100} />
                       </div>
                       <span className="text-xs font-black text-tosca-500 uppercase tracking-widest mb-1 block">
                         Kepala Sekolah
                       </span>
                       <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                         {headmaster.name}
                       </h3>
                       <div className={paragraphs.length > 2 ? `profile-sambutan-container relative ${isSambutanExpanded ? 'open' : ''}` : "relative"}>
                         <div className="text-gray-600 font-medium leading-relaxed italic text-sm md:text-base border-l-2 border-tosca-500 pl-4 space-y-4">
                           {paragraphs.map((para, idx) => (
                             <p key={idx}>{para}</p>
                           ))}
                         </div>
                       </div>
                       
                       {paragraphs.length > 2 && (
                         <button 
                           onClick={() => setIsSambutanExpanded(!isSambutanExpanded)}
                           className="inline-flex items-center gap-2 text-tosca-700 hover:text-tosca-900 font-black uppercase tracking-widest text-[10px] md:text-xs transition-all group py-2 px-3 rounded-xl hover:bg-tosca-50 w-fit mt-2"
                         >
                           <span>
                             {isSambutanExpanded ? "TAMPILKAN LEBIH SEDIKIT" : "BACA SELENGKAPNYA"}
                           </span>
                           <ChevronDown 
                             size={16} 
                             className={`transition-transform duration-500 ease-in-out ${isSambutanExpanded ? "rotate-180" : "rotate-0 group-hover:translate-y-0.5"}`} 
                           />
                         </button>
                       )}
                     </div>
                   </div>
                 ) : kepalaSekolah ? (
                   <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500 max-w-4xl mx-auto">
                     <div className="w-full md:w-[320px] bg-tosca-50 flex-shrink-0 overflow-hidden aspect-[3/4]">
                       <img 
                         src={kepalaSekolah.foto ? getImageUrl(kepalaSekolah.foto) : `https://ui-avatars.com/api/?name=${encodeURIComponent(kepalaSekolah.nama)}&background=2FCFC9&color=fff&size=512`}
                         alt={kepalaSekolah.nama} 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                       />
                     </div>
                     <div className="p-8 md:p-12 flex flex-col justify-center flex-1 relative">
                       <div className="absolute top-0 right-0 p-8 opacity-5 text-tosca-900 pointer-events-none transform -rotate-12">
                         <Quote size={100} />
                       </div>
                       <span className="text-xs font-black text-tosca-500 uppercase tracking-widest mb-1 block">
                         {kepalaSekolah.jabatan}
                       </span>
                       <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                         {kepalaSekolah.nama}
                       </h3>
                       
                       <div className={paragraphs.length > 2 ? `profile-sambutan-container relative ${isSambutanExpanded ? 'open' : ''}` : "relative"}>
                         <div className="text-gray-500 font-medium leading-relaxed italic text-sm md:text-base border-l-2 border-tosca-500 pl-4 space-y-4">
                           {paragraphs.map((para, idx) => (
                             <p key={idx}>{para}</p>
                           ))}
                         </div>
                       </div>
                       
                       {paragraphs.length > 2 && (
                         <button 
                           onClick={() => setIsSambutanExpanded(!isSambutanExpanded)}
                           className="inline-flex items-center gap-2 text-tosca-700 hover:text-tosca-900 font-black uppercase tracking-widest text-[10px] md:text-xs transition-all group py-2 px-3 rounded-xl hover:bg-tosca-50 w-fit mt-2"
                         >
                           <span>
                             {isSambutanExpanded ? "TAMPILKAN LEBIH SEDIKIT" : "BACA SELENGKAPNYA"}
                           </span>
                           <ChevronDown 
                             size={16} 
                             className={`transition-transform duration-500 ease-in-out ${isSambutanExpanded ? "rotate-180" : "rotate-0 group-hover:translate-y-0.5"}`} 
                           />
                         </button>
                       )}

                       {kepalaSekolah.mata_pelajaran && (
                         <div className="mt-6 pt-4 border-t border-gray-100 flex gap-6">
                           <div>
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Spesialisasi</span>
                             <span className="text-xs font-bold text-gray-800">{kepalaSekolah.mata_pelajaran}</span>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
                 ) : (
                   // Fallback Headmaster if not in database
                   <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500 max-w-4xl mx-auto">
                     <div className="w-full md:w-[320px] bg-tosca-50 flex-shrink-0 overflow-hidden aspect-[3/4] flex items-center justify-center text-tosca-200">
                       <Users size={64} />
                     </div>
                     <div className="p-8 md:p-12 flex flex-col justify-center flex-1 relative">
                       <span className="text-xs font-black text-tosca-500 uppercase tracking-widest mb-1 block">
                         Kepala Sekolah
                       </span>
                       <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                         {defaultHeadmaster.name}
                       </h3>
                       
                       <div className={paragraphs.length > 2 ? `profile-sambutan-container relative ${isSambutanExpanded ? 'open' : ''}` : "relative"}>
                         <div className="text-gray-500 font-medium leading-relaxed italic text-sm md:text-base border-l-2 border-tosca-500 pl-4 space-y-4">
                           {paragraphs.map((para, idx) => (
                             <p key={idx}>{para}</p>
                           ))}
                         </div>
                       </div>
                       
                       {paragraphs.length > 2 && (
                         <button 
                           onClick={() => setIsSambutanExpanded(!isSambutanExpanded)}
                           className="inline-flex items-center gap-2 text-tosca-700 hover:text-tosca-900 font-black uppercase tracking-widest text-[10px] md:text-xs transition-all group py-2 px-3 rounded-xl hover:bg-tosca-50 w-fit mt-2"
                         >
                           <span>
                             {isSambutanExpanded ? "TAMPILKAN LEBIH SEDIKIT" : "BACA SELENGKAPNYA"}
                           </span>
                           <ChevronDown 
                             size={16} 
                             className={`transition-transform duration-500 ease-in-out ${isSambutanExpanded ? "rotate-180" : "rotate-0 group-hover:translate-y-0.5"}`} 
                           />
                         </button>
                       )}
                     </div>
                   </div>
                 )}

                {/* Preview Guru Lain */}
                {previewGuru.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                    {previewGuru.map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center flex flex-col items-center group hover:shadow-md transition-all">
                        <div className="w-20 h-20 bg-tosca-50 rounded-full overflow-hidden mb-4 border border-tosca-100 flex-shrink-0">
                          <img 
                            src={item.foto ? getImageUrl(item.foto) : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nama)}&background=2FCFC9&color=fff&size=150`} 
                            alt={item.nama}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="text-xs font-black text-gray-900 line-clamp-1 uppercase tracking-tight">{item.nama}</h4>
                        <p className="text-[10px] font-bold text-tosca-600 uppercase mt-0.5">{item.jabatan}</p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            <div className="text-center mt-12">
              <Link 
                href={`/${unit}/guru`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-tosca-500 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-tosca-600 transition-all hover:scale-105 shadow-md shadow-tosca-500/20"
              >
                <span>Kenali Pengajar Kami</span>
                <ChevronRight size={16} />
              </Link>
            </div>

          </div>
        </section>

        {/* PENUTUP (Jadilah Bagian dari Kami) */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="relative rounded-[40px] p-8 md:p-14 text-white text-center shadow-xl overflow-hidden" style={{ background: "var(--bg-aksen-kokoh)" }}>
            <div className="absolute top-0 left-0 w-full h-full bg-black/5 pointer-events-none rounded-[40px]"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-white/20">
                Penerimaan Siswa Baru
              </span>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight uppercase leading-none">
                {ctaTitle}
              </h2>
              <p className="text-base font-medium text-white/80 mb-10 leading-relaxed">
                Mari bersama mewujudkan masa depan buah hati Anda yang gemilang melalui bimbingan akademis, kreativitas, dan karakter keagamaan yang kuat di {schoolName}.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
                <Link 
                  href={`/${unit}/ppdb`}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-tosca-900 text-xs font-black uppercase tracking-widest rounded-full hover:bg-tosca-50 transition-all hover:scale-105 shadow-lg"
                >
                  Daftar PPDB Online
                </Link>
                <a 
                  href={`https://wa.me/${formatWhatsApp(ctaTelp)}?text=Halo%20Admin%20${encodeURIComponent(schoolName)}%2C%20saya%20ingin%20bertanya%20mengenai%20info%20pendaftaran%20sekolah.`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-white/20 transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  <Phone size={14} />
                  Hubungi Sekolah
                </a>
              </div>

              {/* Kontak Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10 text-sm font-medium text-white/70 max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-3">
                  <Phone size={16} className="text-white shrink-0" />
                  <span>{formatPhoneDisplay(ctaTelp)}</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Mail size={16} className="text-white shrink-0" />
                  <span className="truncate">{ctaEmail}</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <MapPin size={16} className="text-white shrink-0" />
                  <span className="truncate">
                    <ExpandableText text={ctaAlamat} maxLength={30} />
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
