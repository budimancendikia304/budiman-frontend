"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Home, 
  FileText, 
  Newspaper, 
  Bell, 
  Calendar, 
  Award, 
  Users, 
  Image, 
  ClipboardList, 
  Settings, 
  Instagram, 
  LogOut,
  Shield
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  unit: "sd" | "smp";
  title: string;
}

export default function DashboardLayout({
  children,
  unit,
  title,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const savedUnit = localStorage.getItem("admin_unit");

    if (token && savedUnit === unit) {
      setIsAdmin(true);
    }
  }, [unit]);

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
        console.error("Error fetching logo in dashboard layout:", err);
      }
    };
    fetchLogo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_unit");
    setIsAdmin(false);
    window.location.href = "/";
  };

  const navItems = [
    { name: "Dashboard", href: `/admin/${unit}/dashboard`, icon: Home },
    { name: "Artikel", href: `/admin/${unit}/artikel`, icon: FileText },
    { name: "Berita", href: `/admin/${unit}/berita`, icon: Newspaper },
    { name: "Pengumuman", href: `/admin/${unit}/pengumuman`, icon: Bell },
    { name: "Agenda", href: `/admin/${unit}/agenda`, icon: Calendar },
    { name: "Prestasi", href: `/admin/${unit}/prestasi`, icon: Award },
    { name: "Guru", href: `/admin/${unit}/guru`, icon: Users },
    { name: "Galeri", href: `/admin/${unit}/galeri`, icon: Image },
    { name: "PPDB", href: `/admin/${unit}/ppdb`, icon: ClipboardList },
    { name: "Pengaturan Website", href: `/admin/${unit}/settings`, icon: Settings },
    { name: "Sosial Media", href: `/admin/${unit}/social-media`, icon: Instagram },
    { name: "Keamanan Akun", href: `/admin/${unit}/security`, icon: Shield },
  ];

  const themeSidebar = "bg-tosca-900";
  const themeActive = "bg-tosca-700";
  const themeHover = "hover:bg-tosca-700";

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } h-screen sticky top-0 transition-all duration-300 ${themeSidebar} text-white flex flex-col shadow-2xl z-20 overflow-hidden`}
      >
        <div className="p-6 flex items-center justify-between border-b border-tosca-700/50">
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
                  Budiman
                </span>
                <span className="text-[9px] font-black text-tosca-200 uppercase tracking-widest mt-1">
                  {unit} Admin
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-tosca-700 hover:bg-tosca-500 transition-colors shadow-inner text-[10px] font-bold cursor-pointer"
          >
            {isSidebarOpen ? 'CLOSE' : 'OPEN'}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto scrollable">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                  pathname === item.href ? themeActive : themeHover
                }`}
              >
                <Icon size={16} className="text-tosca-300 group-hover:text-white shrink-0" />
                {isSidebarOpen && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-tosca-700/50">
          {isAdmin ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/80 hover:bg-red-600 transition-all shadow-lg hover:shadow-red-500/20 group cursor-pointer"
            >
              <LogOut size={16} className="shrink-0" />
              {isSidebarOpen && (
                <span className="font-medium">Logout</span>
              )}
            </button>
          ) : (
            <Link
              href={`/admin/login?unit=${unit}`}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-tosca-500 hover:bg-tosca-200 hover:text-tosca-900 transition-all shadow-lg shadow-tosca-500/20 group"
            >
              {isSidebarOpen && (
                <span className="font-medium">Login Admin</span>
              )}
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-18 flex items-center justify-between px-8 z-10">
          <h1 className="text-lg font-semibold text-gray-700">
            <span className="text-tosca-700 font-bold mr-2">|</span>
            {title}
          </h1>
          <div className="flex items-center gap-6">
            {!isAdmin && (
              <Link
                href={`/admin/login?unit=${unit}`}
                className="hidden sm:block px-6 py-2 bg-tosca-50 text-tosca-700 font-bold rounded-xl border border-tosca-200 hover:bg-tosca-500 hover:text-white transition-all duration-300"
              >
                Login Admin
              </Link>
            )}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-800">
                {isAdmin ? `Admin ${unit.toUpperCase()}` : "Tamu / Publik"}
              </span>
              <span
                className={`text-[10px] uppercase font-black tracking-tighter ${isAdmin ? "text-green-500" : "text-gray-400"}`}
              >
                {isAdmin ? "Terautentikasi" : "Akses Publik"}
              </span>
            </div>
            <div
              className={`w-11 h-11 rounded-2xl ${isAdmin ? "bg-tosca-500" : "bg-gray-200"} flex items-center justify-center text-white font-bold shadow-lg transform hover:rotate-3 transition-transform cursor-pointer`}
            >
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] p-8">
          {children}
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
