"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  ChevronLeft, 
  ChevronRight,
  Home, 
  FileText, 
  Newspaper, 
  Bell, 
  Calendar, 
  Award, 
  Users, 
  User, 
  Building, 
  Compass, 
  Image, 
  ClipboardList, 
  Settings, 
  Instagram, 
  LogOut,
  Shield
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  unit: "sd" | "smp";
  title: string;
}

export default function AdminLayout({
  children,
  unit,
  title,
}: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const savedUnit = localStorage.getItem("admin_unit");

    if (!token || savedUnit !== unit) {
      toast.error("Akses ditolak. Silakan login sebagai admin.");
      router.push(`/admin/login?unit=${unit}`);
    } else {
      setLoading(false);
    }
  }, [router, unit]);

  useEffect(() => {
    document.body.classList.remove("theme-sd", "theme-smp");
    if (unit === "sd") {
      document.body.classList.add("theme-sd");
    } else if (unit === "smp") {
      document.body.classList.add("theme-smp");
    }
    return () => {
      document.body.classList.remove("theme-sd", "theme-smp");
    };
  }, [unit]);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const res = await fetch(`${apiUrl}/settings`);
        const data = await res.json();
        if (data && data.site_logo) {
          setLogoUrl(data.site_logo);
        }
      } catch (err) {
        console.error("Error fetching logo in admin layout:", err);
      }
    };
    fetchLogo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_unit");
    router.push("/");
  };

  const groupedNavItems = [
    {
      groupName: "Konten & Informasi",
      items: [
        { name: "Admin Home", href: `/admin/${unit}/dashboard`, icon: Home },
        { name: "Artikel", href: `/admin/${unit}/artikel`, icon: FileText },
        { name: "Berita", href: `/admin/${unit}/berita`, icon: Newspaper },
        { name: "Pengumuman", href: `/admin/${unit}/pengumuman`, icon: Bell },
        { name: "Agenda", href: `/admin/${unit}/agenda`, icon: Calendar },
        { name: "Prestasi", href: `/admin/${unit}/prestasi`, icon: Award },
      ]
    },
    {
      groupName: "Profil & Kelembagaan",
      items: [
        { name: "Guru", href: `/admin/${unit}/guru`, icon: Users },
        { name: "Kepala Sekolah", href: `/admin/${unit}/headmaster`, icon: User },
        { name: "Program & Fasilitas", href: `/admin/${unit}/program-fasilitas`, icon: Building },
        { name: "Ekstrakurikuler", href: `/admin/${unit}/ekstrakurikuler`, icon: Compass },
        { name: "Profil Lembaga", href: `/admin/${unit}/profil-lembaga`, icon: FileText },
        { name: "Galeri", href: `/admin/${unit}/galeri`, icon: Image },
      ]
    },
    {
      groupName: "Layanan & Pengaturan",
      items: [
        { name: "PPDB", href: `/admin/${unit}/ppdb`, icon: ClipboardList },
        { name: "Pengaturan Website", href: `/admin/${unit}/settings`, icon: Settings },
        { name: "Sosial Media", href: `/admin/${unit}/social-media`, icon: Instagram },
        { name: "Keamanan Akun", href: `/admin/${unit}/security`, icon: Shield },
      ]
    }
  ];

  if (loading) return null;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} h-screen sticky top-0 transition-all duration-300 bg-gray-900 text-white flex flex-col shadow-2xl z-20 overflow-hidden`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          {isSidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-tosca-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  "B"
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight leading-none">
                  Budiman Admin
                </span>
                <span className="text-[9px] font-black text-tosca-500 uppercase tracking-widest mt-1">
                  {unit} Panel
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-gray-800 hover:bg-tosca-500 transition-colors flex items-center justify-center cursor-pointer"
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-6 overflow-y-auto scrollable">
          {groupedNavItems.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              {isSidebarOpen ? (
                <div className="px-3 text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                  {group.groupName}
                </div>
              ) : (
                <div className="h-[1px] bg-white/10 my-4" />
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.includes(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${isActive ? "bg-tosca-700 text-white font-bold" : "text-white/80 hover:bg-gray-800 hover:text-white"}`}
                  >
                    <Icon 
                      size={18} 
                      className={`shrink-0 ${isActive ? "text-white" : "text-white/60 group-hover:text-white"} transition-colors`} 
                    />
                    {isSidebarOpen && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/80 hover:bg-red-600 transition-all shadow-lg group cursor-pointer"
          >
            <LogOut size={16} className="shrink-0" />
            {isSidebarOpen && (
              <span className="font-medium">Logout Admin</span>
            )}
          </button>
        </div>
      </aside>


      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <Link
              href={`/${unit}`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all"
            >
              Web Publik
            </Link>
            <h1 className="text-lg font-black text-gray-800 tracking-tight uppercase">
              <span className="text-tosca-500 mr-2">|</span> {title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-gray-900 leading-none">
                Administrator
              </span>
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>{" "}
                Aktif
              </span>
            </div>
            <div className="w-12 h-12 bg-tosca-500 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-tosca-500/20">
              A
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          {children}
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
