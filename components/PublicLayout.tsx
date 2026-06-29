"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, Instagram, LogIn, Menu, X, ChevronDown } from "lucide-react";

interface PublicLayoutProps {
  children: React.ReactNode;
  unit: "sd" | "smp";
}

export default function PublicLayout({ children, unit }: PublicLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [telpAdmin, setTelpAdmin] = useState("081534648183");
  const [whatsappNumber, setWhatsappNumber] = useState("6281534648183");
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

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

  const toggleMobileDropdown = (name: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  
  const linkRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [bubbleStyle, setBubbleStyle] = useState<{ left: number; width: number; height: number; top: number } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Fetch site settings
    const fetchSettings = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const res = await fetch(`${apiUrl}/settings`);
        if (!res.ok) {
          console.warn(`Failed to fetch settings, status: ${res.status}`);
          return;
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.warn("Response is not JSON");
          return;
        }
        const data = await res.json();
        if (data) {
          if (data.site_logo) {
            setLogoUrl(data.site_logo);
          }
          const telpKey = `profil_telp_${unit}`;
          if (data[telpKey]) {
            setTelpAdmin(data[telpKey]);
          }
          if (data.whatsapp_number) {
            setWhatsappNumber(data.whatsapp_number);
          }
        }
      } catch (err) {
        console.warn("Error fetching settings (silent):", err);
      }
    };
    fetchSettings();

    return () => window.removeEventListener("scroll", handleScroll);
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

  const navLinks: {
    name: string;
    href: string;
    isExternal?: boolean;
    dropdown?: { name: string; href: string }[];
  }[] = [
    { name: "Beranda", href: `/${unit}` },
    { 
      name: "Profil Sekolah", 
      href: `/${unit}/profil-lembaga`,
      dropdown: [
        { name: "Profil Lembaga", href: `/${unit}/profil-lembaga` },
        { name: "Program & Fasilitas", href: `/${unit}/fasilitas` },
        { name: "Tenaga Pengajar (Guru)", href: `/${unit}/guru` },
        { name: "Ekstrakurikuler", href: `/${unit}/ekstrakurikuler` },
      ]
    },
    { 
      name: "Informasi", 
      href: `/${unit}/berita`,
      dropdown: [
        { name: "Berita & Kegiatan", href: `/${unit}/berita` },
        { name: "Agenda Sekolah", href: `/${unit}/agenda` },
      ]
    },
    { 
      name: "Galeri", 
      href: `/${unit}/galeri`,
      dropdown: [
        { name: "Galeri Foto", href: `/${unit}/galeri` },
        { name: "Prestasi Siswa", href: `/${unit}/prestasi` },
      ]
    },
  ];

  const activeIndex = navLinks.findIndex(link => 
    pathname === link.href || (link.dropdown && link.dropdown.some(s => pathname === s.href))
  );

  useEffect(() => {
    const updateBubble = () => {
      if (activeIndex !== -1 && linkRefs.current[activeIndex]) {
        const activeElement = linkRefs.current[activeIndex];
        if (activeElement) {
          setBubbleStyle({
            left: activeElement.offsetLeft,
            width: activeElement.offsetWidth,
            height: activeElement.offsetHeight,
            top: activeElement.offsetTop,
          });
        }
      } else {
        setBubbleStyle(null);
      }
    };

    updateBubble();
    const timer = setTimeout(updateBubble, 100);
    window.addEventListener("resize", updateBubble);
    return () => {
      window.removeEventListener("resize", updateBubble);
      clearTimeout(timer);
    };
  }, [activeIndex, pathname]);

  const brandColor = unit === "sd" ? "text-tosca-600" : "text-tosca-900";
  const accentBg = unit === "sd" ? "bg-tosca-50 text-tosca-600" : "bg-tosca-50 text-tosca-900";

  return (
    <div className="min-h-screen bg-main font-sans text-gray-900 overflow-x-hidden">
      {/* Strict Mobile CSS Fallbacks */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .desktop-nav-menu {
            display: none !important;
          }
          .desktop-login-btn {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
      `}} />
      {/* Top Bar */}
      <div 
        className={`fixed top-0 left-0 right-0 z-[60] bg-[#0B6B69] text-white transition-all duration-500 ${
          isScrolled ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center text-[11px] md:text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-tosca-300 shrink-0" />
              <span className="opacity-90 select-all">{formatPhoneDisplay(telpAdmin)}</span>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex">
              <Mail size={14} className="text-tosca-300 shrink-0" />
              <span className="opacity-90 normal-case select-all">budimancendikia304@gmail.com</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a 
              href={`https://wa.me/${formatWhatsApp(whatsappNumber)}?text=Halo%20Admin%2C%20saya%20ingin%20bertanya%20mengenai%20info%20sekolah.`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-tosca-300 transition-colors inline-flex items-center gap-2 hover:bg-white/10 px-2 py-1 sm:px-2.5 sm:py-1 rounded-full transition-all" 
              aria-label="WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="shrink-0" style={{ display: 'block', lineHeight: 'normal' }}>
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.419 5.422.002 12.005.002c3.192.001 6.192 1.244 8.448 3.501 2.256 2.257 3.497 5.257 3.495 8.45-.004 6.581-5.424 11.998-12.008 11.998-2.005-.002-3.98-.507-5.73-1.472L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.449 5.49 0 9.957-4.467 9.96-9.96.002-2.661-1.034-5.163-2.915-7.046C16.48 1.714 13.98.674 11.32.674 5.828.674 1.36 5.14 1.358 10.63c-.001 1.704.476 3.238 1.387 4.678l-.993 3.626 3.71-.973.505.293zm9.055-6.72c-.243-.122-1.434-.708-1.656-.79-.22-.082-.38-.122-.54.122-.16.244-.622.79-.762.948-.14.158-.28.178-.522.057a7.279 7.279 0 0 1-3.233-1.993c-.886-.788-1.485-1.761-1.66-2.066-.173-.306-.018-.472.133-.623.136-.137.304-.35.457-.525.152-.174.203-.298.304-.497.102-.2.05-.374-.025-.522-.076-.148-.622-1.503-.852-2.057-.225-.54-.472-.466-.648-.475-.168-.008-.36-.01-.552-.01-.192 0-.505.072-.77.36-.264.288-1.01.986-1.01 2.404s1.03 2.788 1.173 2.98c.143.195 2.025 3.093 4.908 4.336.685.296 1.22.473 1.637.605.69.22 1.32.19 1.816.116.553-.082 1.434-.586 1.637-1.155.203-.57.203-1.057.142-1.155-.06-.1-.22-.158-.463-.28z"/>
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <a 
              href="https://www.instagram.com/sat_almanshurah/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-tosca-300 transition-colors inline-flex items-center gap-2 hover:bg-white/10 px-2 py-1 sm:px-2.5 sm:py-1 rounded-full transition-all" 
              aria-label="Instagram"
            >
              <Instagram size={14} className="shrink-0" style={{ display: 'block', lineHeight: 'normal' }} />
              <span className="hidden sm:inline">Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Capsule Navbar */}
      <div className={`fixed left-0 right-0 z-50 transition-all duration-700 flex justify-center px-4 md:px-8 ${
        isScrolled ? "top-4 md:top-5" : "top-12 md:top-14"
      }`}>
        <nav 
          className="w-full transition-all duration-700 flex items-center justify-between px-3 md:px-4 rounded-full"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "var(--bg-aksen-kokoh)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
            overflow: "visible",
            boxSizing: "border-box",
            maxWidth: "min(95%, 1100px)",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 30px",
            height: "76px"
          }}
        >
          {/* Logo container (flex-1 to help center the menu) */}
          <div className="flex-1 flex justify-start items-center">
            <Link href="/" className="flex items-center gap-3 md:gap-4 pl-2 md:pl-4 group shrink-0 mr-6 xl:mr-10">
              <div className="w-10 h-10 md:w-11 md:h-11 bg-tosca-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg shadow-tosca-500/20 group-hover:rotate-12 transition-transform overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  "B"
                )}
              </div>
              <div 
                className="flex flex-col justify-center"
                style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
              >
                <span className="font-black text-sm min-[375px]:text-base md:text-lg tracking-tighter leading-none text-white transition-colors group-hover:text-[var(--warna-nav-hover)]">BUDIMAN</span>
                <span 
                  className="font-bold uppercase tracking-[0.2em] text-[var(--warna-nav-hover)]/60 text-[9px] min-[375px]:text-[10px]"
                  style={{ lineHeight: "1.2" }}
                >
                  CENDIKIA {unit.toUpperCase()}
                </span>
              </div>
            </Link>
          </div>
 
          {/* Desktop Menu (Centered within single container wrapper) */}
          <div 
            className="hidden md:flex items-center justify-center flex-initial mx-2 desktop-nav-menu"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "32px",
              background: "rgba(0, 0, 0, 0.12)",
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(255, 255, 255, 0.1)",
              borderRadius: "30px",
              padding: "10px 28px",
              height: "auto"
            }}
          >
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href || (link.dropdown && link.dropdown.some(s => pathname === s.href));
              const linkClass = `flex items-center gap-1.5 px-[15px] py-[8px] text-[13px] xl:text-[14px] font-semibold uppercase tracking-wider leading-none whitespace-nowrap transition-all duration-300 ${
                isActive ? "text-white active opacity-100" : "text-[var(--warna-nav-hover)] opacity-[0.65] hover:opacity-[0.85]"
              }`;
              
              return (
                <div 
                  key={link.name} 
                  ref={(el) => { linkRefs.current[index] = el; }}
                  className="relative group z-10"
                >
                  {link.isExternal ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      <span>{link.name}</span>
                    </a>
                  ) : (
                    <Link 
                      href={link.href}
                      className={linkClass}
                    >
                      <span>{link.name}</span>
                      {link.dropdown && <ChevronDown size={12} className="transition-transform duration-300 opacity-50 group-hover:rotate-180" />}
                    </Link>
                  )}

                  {link.dropdown && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 z-[60] opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                      <div 
                        className="p-1.5 min-w-[200px] flex flex-col gap-0.5"
                        style={{
                          background: "#0B6B69",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}
                      >
                        {link.dropdown.map((sub) => (
                          <Link 
                            key={sub.name}
                            href={sub.href}
                            className={`px-4 py-2 text-[12px] font-medium rounded transition-all whitespace-nowrap ${
                              pathname === sub.href ? "text-white bg-white/10" : "text-[var(--warna-nav-hover)]/80 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
  
          <div className="flex-1 flex justify-end items-center gap-[10px] md:gap-[15px] pr-2 md:pr-4">
            <div className="relative group z-[70] hidden md:block desktop-login-btn">
              <div 
                className="cursor-pointer text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] rounded-full transition-all flex items-center gap-2 whitespace-nowrap"
                style={{
                  padding: "8px 20px",
                  background: "var(--bg-nav-login-btn)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-nav-login-btn-hover)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--bg-nav-login-btn)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <LogIn size={13} className="hidden sm:block" />
                <span>LOGIN</span>
                <ChevronDown size={12} className="transition-transform duration-300 opacity-70 group-hover:rotate-180" />
              </div>

              {/* Dropdown Menu */}
              <div 
                className="absolute top-full pt-3 transition-all duration-300 z-[80] opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
                style={{ right: 0, left: "auto" }}
              >
                <div 
                  className="flex flex-col"
                  style={{
                    background: "var(--bg-nav-dropdown)",
                    borderRadius: "20px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    padding: "12px 20px",
                    width: "max-content",
                    minWidth: "160px",
                    gap: "10px"
                  }}
                >
                  <Link 
                    href={`/admin/login?unit=${unit}`}
                    className="pb-2 text-[12px] font-bold text-[var(--warna-nav-hover)]/80 hover:text-white transition-all whitespace-nowrap uppercase tracking-wider block"
                    style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
                  >
                    Login Admin
                  </Link>
                  <a 
                    href={`https://wa.me/${formatWhatsApp(whatsappNumber)}?text=Halo%20Admin%2C%20saya%20ingin%20bertanya%20mengenai%20info%20sekolah.`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] font-bold text-[var(--warna-nav-hover)]/80 hover:text-white transition-all whitespace-nowrap uppercase tracking-wider block"
                  >
                    Hubungi Sekolah
                  </a>
                </div>
              </div>
            </div>
 
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden w-9 h-9 flex items-center justify-center bg-white/10 text-white rounded-full hover:bg-white/20 transition-all mobile-hamburger-btn"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Backdrop overlay with blur */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Slide-out drawer with blur background */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-[320px] max-w-[85vw] h-full z-[101] shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "linear-gradient(135deg, rgba(15, 168, 164, 0.8) 0%, rgba(11, 107, 105, 0.9) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-tosca-500 rounded-full flex items-center justify-center text-white font-black text-sm overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                "B"
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xs tracking-tighter leading-none text-white">BUDIMAN</span>
              <span className="font-bold uppercase tracking-[0.2em] text-[var(--warna-nav-hover)]/60 text-[8px]">
                CENDIKIA {unit.toUpperCase()}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center bg-white/10 text-white rounded-full hover:bg-white/20 transition-all cursor-pointer"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto py-6 px-6 space-y-4 scrollable">
          {navLinks.map((link) => {
            if (!link.dropdown) {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-xs font-bold rounded-xl transition-all uppercase tracking-wider text-center ${
                    isActive 
                      ? "bg-white/20 text-white font-extrabold" 
                      : "text-white/90 hover:bg-white/5 hover:text-white"
                  }`}
                  style={{ padding: "12px" }}
                >
                  {link.name}
                </Link>
              );
            }

            const isDropdownOpen = !!openDropdowns[link.name];
            const hasActiveChild = link.dropdown.some(sub => pathname === sub.href);

            return (
              <div key={link.name} className="space-y-1.5">
                <button
                  onClick={() => toggleMobileDropdown(link.name)}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider transition-all rounded-xl text-white hover:bg-white/5 cursor-pointer"
                  style={{ padding: "12px" }}
                >
                  <span className={hasActiveChild ? "text-white font-extrabold" : "text-white/90"}>
                    {link.name}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-300 opacity-70 ${isDropdownOpen ? "rotate-180" : ""}`} 
                  />
                </button>

                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out pl-3 border-l border-white/10 flex flex-col gap-1 ${
                    isDropdownOpen ? "max-h-[300px] opacity-100 mt-1" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  {link.dropdown.map((sub) => (
                    <Link 
                      key={sub.name}
                      href={sub.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block text-xs font-semibold rounded-xl transition-colors ${
                        pathname === sub.href 
                          ? "bg-white/15 text-white font-bold" 
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                      style={{ padding: "10px 12px" }}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Divider */}
          <div className="h-[1px] bg-white/10 my-2" />

          {/* LOGIN ADMIN */}
          <Link 
            href={`/admin/login?unit=${unit}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center justify-center gap-2 text-center text-xs font-black uppercase tracking-[0.15em] rounded-xl py-3.5 hover:bg-white/20 transition-all ${
              pathname.startsWith("/admin/login") 
                ? "bg-white/25 text-white font-extrabold" 
                : "bg-white/10 text-white border border-white/20"
            }`}
            style={{ padding: "12px" }}
          >
            <LogIn size={14} />
            LOGIN ADMIN
          </Link>

          {/* HUBUNGI SEKOLAH */}
          <a 
            href={`https://wa.me/${formatWhatsApp(whatsappNumber)}?text=Halo%20Admin%2C%20saya%20ingin%20bertanya%20mengenai%20info%20sekolah.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-[0.15em] rounded-xl py-3.5 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            style={{ padding: "12px" }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            HUBUNGI SEKOLAH
          </a>
        </div>
      </div>

      <main className="pt-28 md:pt-44 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards', animationDuration: '1s' }}>
        {children}
      </main>

      {/* Footer */}
      <footer 
        className="pt-24 pb-12 border-t border-white/10"
        style={{ background: "var(--bg-aksen-kokoh)" }}
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-black tracking-tighter text-white">Budiman Cendikia {unit.toUpperCase()}</span>
            </div>
            <p className="font-medium leading-relaxed max-w-md text-white/80">
              Lembaga pendidikan yang berkomitmen mencetak generasi unggul dalam iman, taqwa, dan ilmu pengetahuan. Menjadi rumah kedua yang nyaman bagi perkembangan anak.
            </p>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-white">Navigasi</h4>
            <ul className="space-y-4">
              {navLinks.map(link => (
                <li key={link.name}>
                  {link.name === "Beranda" ? (
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-white/80 hover:text-border-halus font-bold text-sm transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      href={link.href} 
                      className="text-white/80 hover:text-border-halus font-bold text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-white">Kontak Kami</h4>
            <ul className="space-y-4 text-sm font-medium text-white/80">
              <li className="flex items-start gap-3">
                <span>Jalan Alumunium III No. 79, Tanjung Mulia, Kecamatan Medan Deli, Kota Medan, Sumatera Utara 20241</span>
              </li>
              <li className="flex items-center gap-3">
                <a 
                  href={`https://wa.me/${formatWhatsApp(whatsappNumber)}?text=Halo%20Admin%2C%20saya%20ingin%20bertanya%20mengenai%20info%20sekolah.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-all"
                >
                  {formatPhoneDisplay(telpAdmin)}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span>budimancendikia304@gmail.com</span>
              </li>
              <li className="flex flex-col gap-1 pt-2 border-t border-white/10">
                <span className="text-[10px] font-black uppercase tracking-wider text-border-halus">Jam Admin</span>
                <span>Senin - Jumat 08.00 s/d 16.00</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6 border-white/15">
          <p className="font-bold text-[10px] uppercase tracking-widest text-white/60">© 2026 Budiman Cendikia. All Rights Reserved.</p>
          <div className="flex gap-4">
             <a 
               href={`https://wa.me/${formatWhatsApp(whatsappNumber)}?text=Halo%20Admin%2C%20saya%20ingin%20bertanya%20mengenai%20info%20sekolah.`} 
               target="_blank"
               rel="noopener noreferrer"
               aria-label="WhatsApp"
               className="w-10 h-10 rounded-xl shadow-sm flex items-center justify-center transition-all cursor-pointer border bg-white/10 text-white hover:bg-white hover:text-warna-teks-mutlak border-white/20"
             >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.419 5.422.002 12.005.002c3.192.001 6.192 1.244 8.448 3.501 2.256 2.257 3.497 5.257 3.495 8.45-.004 6.581-5.424 11.998-12.008 11.998-2.005-.002-3.98-.507-5.73-1.472L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.449 5.49 0 9.957-4.467 9.96-9.96.002-2.661-1.034-5.163-2.915-7.046C16.48 1.714 13.98.674 11.32.674 5.828.674 1.36 5.14 1.358 10.63c-.001 1.704.476 3.238 1.387 4.678l-.993 3.626 3.71-.973.505.293zm9.055-6.72c-.243-.122-1.434-.708-1.656-.79-.22-.082-.38-.122-.54.122-.16.244-.622.79-.762.948-.14.158-.28.178-.522.057a7.279 7.279 0 0 1-3.233-1.993c-.886-.788-1.485-1.761-1.66-2.066-.173-.306-.018-.472.133-.623.136-.137.304-.35.457-.525.152-.174.203-.298.304-.497.102-.2.05-.374-.025-.522-.076-.148-.622-1.503-.852-2.057-.225-.54-.472-.466-.648-.475-.168-.008-.36-.01-.552-.01-.192 0-.505.072-.77.36-.264.288-1.01.986-1.01 2.404s1.03 2.788 1.173 2.98c.143.195 2.025 3.093 4.908 4.336.685.296 1.22.473 1.637.605.69.22 1.32.19 1.816.116.553-.082 1.434-.586 1.637-1.155.203-.57.203-1.057.142-1.155-.06-.1-.22-.158-.463-.28z"/>
                </svg>
             </a>
             <a 
               href="https://www.instagram.com/sat_almanshurah/" 
               target="_blank"
               rel="noopener noreferrer"
               aria-label="Instagram"
               className="w-10 h-10 rounded-xl shadow-sm flex items-center justify-center transition-all cursor-pointer border bg-white/10 text-white hover:bg-white hover:text-warna-teks-mutlak border-white/20"
             >
                <Instagram size={18} />
             </a>
             <Link 
               href="#" 
               aria-label="TikTok"
               className="w-10 h-10 rounded-xl shadow-sm flex items-center justify-center transition-all cursor-pointer border bg-white/10 text-white hover:bg-white hover:text-warna-teks-mutlak border-white/20"
             >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.74-3.99-1.66-.22-.17-.41-.36-.6-.56v7.13c-.02 2.63-.99 5.13-2.92 6.84-2.14 1.89-5.19 2.58-7.99 1.81-2.92-.77-5.34-3.13-6.07-6.07-.9-3.41.25-7.23 2.99-9.37 1.95-1.54 4.54-2.14 7-1.63v4.05c-.86-.18-1.78-.11-2.58.26-.81.36-1.48.99-1.86 1.78-.63 1.26-.41 2.92.56 3.94.97 1.02 2.52 1.25 3.73.57.77-.43 1.22-1.22 1.23-2.1V.02z"/>
                </svg>
             </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
