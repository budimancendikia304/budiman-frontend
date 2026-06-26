"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  unit: "sd" | "smp" | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/me");
        setUser(response.data);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("admin_token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-tosca-500 border-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-tosca-50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-tosca-100 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl opacity-40"></div>

      <div className="max-w-4xl w-full text-center relative z-10">
        <div className="inline-block px-4 py-1.5 bg-tosca-50 text-tosca-700 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-tosca-100">
          Budiman Cendikia Portal
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
          Selamat Datang{user ? `, ${user.name}` : ""}
        </h1>
        <p className="text-lg text-gray-500 mb-12 font-medium max-w-2xl mx-auto">
          Silakan pilih unit sekolah untuk melihat informasi terbaru, daftar guru, dan pengumuman.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* SD Card */}
          <Link href="/admin/sd/dashboard" className="group">
            <div className="bg-white p-10 rounded-[40px] shadow-xl hover:shadow-tosca-500/10 transition-all border-b-[12px] border-tosca-500 transform hover:-translate-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-8xl font-black">SD</span>
              </div>
              <div className="w-24 h-24 bg-tosca-50 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 group-hover:bg-tosca-500 transition-all duration-500 shadow-inner">
                <span className="text-4xl font-black text-tosca-700 group-hover:text-white">SD</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Unit SD</h2>
              <p className="text-gray-400 font-medium leading-relaxed">
                Informasi berita, profil guru, galeri, dan pengumuman Sekolah Dasar.
              </p>
              <div className="mt-8 flex items-center justify-center text-tosca-700 font-bold group-hover:translate-x-2 transition-transform">
                Buka Dashboard
              </div>
            </div>
          </Link>

          {/* SMP Card */}
          <Link href="/admin/smp/dashboard" className="group">
            <div className="bg-white p-10 rounded-[40px] shadow-xl hover:shadow-tosca-700/10 transition-all border-b-[12px] border-tosca-700 transform hover:-translate-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-8xl font-black">SMP</span>
              </div>
              <div className="w-24 h-24 bg-tosca-100 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 group-hover:bg-tosca-700 transition-all duration-500 shadow-inner">
                <span className="text-4xl font-black text-tosca-900 group-hover:text-white">SMP</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Unit SMP</h2>
              <p className="text-gray-400 font-medium leading-relaxed">
                Informasi berita, profil guru, galeri, dan pengumuman Sekolah Menengah Pertama.
              </p>
              <div className="mt-8 flex items-center justify-center text-tosca-900 font-bold group-hover:translate-x-2 transition-transform">
                Buka Dashboard
              </div>
            </div>
          </Link>
        </div>

        {user ? (
          <button
            onClick={() => {
              localStorage.removeItem("admin_token");
              localStorage.removeItem("admin_unit");
              setUser(null);
            }}
            className="mt-16 text-red-500 font-black text-sm uppercase tracking-widest hover:text-red-700 transition-colors"
          >
            Logout dari sistem
          </button>
        ) : (
          <div className="mt-16 flex items-center justify-center gap-2 text-gray-400 font-medium">
            Ingin mengelola konten? 
            <Link href="/admin/login" className="text-tosca-700 font-black hover:underline ml-1">
              Login Admin
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
