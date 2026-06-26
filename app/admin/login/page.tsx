"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { toast, ToastContainer } from "react-toastify";

import { Eye, EyeOff, LogIn } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unit = searchParams.get("unit") || "sd";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit triggered", { email, password });
    setIsLoading(true);

    try {
      const response = await api.post("/login", { email, password });
      const { token, user } = response.data;

      if (user.unit !== unit) {
        toast.error(`Akun Anda terdaftar untuk unit ${user.unit.toUpperCase()}.`);
        setIsLoading(false);
        return;
      }

      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_unit", user.unit);
      toast.success("Login Berhasil!");
      router.push(`/admin/${unit}/dashboard`);
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || "Login Gagal. Cek kembali email & password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Admin Login</h2>
        <p className="text-tosca-700 mt-2 capitalize font-bold text-sm tracking-widest uppercase">
          Unit {unit.toUpperCase()}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
            Email Address
          </label>
          <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50"
                placeholder="nama@gmail.com"
              />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
            Password
          </label>
          <div className="relative">
             <input
               type={showPassword ? "text" : "password"}
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               className="w-full pl-5 pr-12 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-tosca-500/10 focus:border-tosca-500 transition-all outline-none bg-gray-50/50"
               placeholder="••••••••"
             />
             <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:text-gray-600 p-1 rounded-lg"
               aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
             >
               {showPassword ? (
                 <EyeOff className="w-5 h-5" />
               ) : (
                 <Eye className="w-5 h-5" />
               )}
             </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-2xl text-white font-black tracking-wide transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
            unit === "sd"
              ? "bg-tosca-500 hover:bg-tosca-700 shadow-tosca-500/30"
              : "bg-tosca-700 hover:bg-tosca-900 shadow-tosca-700/30"
          } ${isLoading ? "opacity-70 cursor-not-allowed scale-95" : "hover:-translate-y-1"}`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <LogIn size={18} />
              <span>Masuk</span>
            </>
          )}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-tosca-50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-tosca-200 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-30"></div>
      
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
