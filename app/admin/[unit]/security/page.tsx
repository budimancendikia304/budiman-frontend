"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { Shield, Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function AdminSecurityPage() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";

  const [loading, setLoading] = useState(true);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Form states
  const [emailForm, setEmailForm] = useState({
    email: "",
    current_password: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  // Password visibility states
  const [showPass, setShowPass] = useState<Record<string, boolean>>({});

  const toggleShowPass = (key: string) => {
    setShowPass((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (!unit) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get("/me");
        if (res.data) {
          setEmailForm((prev) => ({ ...prev, email: res.data.email || "" }));
        }
      } catch (err) {
        console.error("Gagal memuat profil admin:", err);
        toast.error("Gagal memuat profil admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [unit]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdatingEmail(true);
      const res = await api.post("/profile/update-email", emailForm);
      toast.success(res.data?.message || "Email login berhasil diperbarui!");
      setEmailForm((prev) => ({ ...prev, current_password: "" }));
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal memperbarui email.");
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error("Password baru dan konfirmasi password tidak cocok.");
      return;
    }

    try {
      setUpdatingPassword(true);
      const res = await api.post("/profile/update-password", passwordForm);
      toast.success(res.data?.message || "Password berhasil diperbarui!");
      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal memperbarui password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <AdminLayout unit={unit} title="Keamanan Akun">
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-tosca-500 border-gray-200"></div>
        </div>
      ) : (
        <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center py-6 max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <span className="text-tosca-600 font-bold uppercase tracking-widest text-[10px]">Panel Admin</span>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-1">Keamanan Akun</h1>
            <p className="text-xs text-gray-400 font-medium mt-1">Ubah alamat email login dan perbarui kata sandi administratif Anda secara aman.</p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Card 1: Perbarui Email */}
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-md h-full">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-tosca-50 rounded-xl flex items-center justify-center text-tosca-600">
                  <Mail size={22} />
                </div>
                <div>
                  <span className="text-tosca-600 font-bold uppercase tracking-widest text-[9px]">Ganti Akun</span>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none mt-1">Perbarui Email</h2>
                </div>
              </div>

              <form onSubmit={handleUpdateEmail} className="space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Alamat Email Baru</label>
                    <input
                      type="email"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                      placeholder="admin@sekolah.sch.id"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-tosca-500 transition-all font-medium"
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Password Saat Ini</label>
                    <div className="relative">
                      <input
                        type={showPass["email_curr"] ? "text" : "password"}
                        value={emailForm.current_password}
                        onChange={(e) => setEmailForm({ ...emailForm, current_password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-tosca-500 transition-all font-medium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPass("email_curr")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPass["email_curr"] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={updatingEmail}
                    className="w-full py-4 bg-tosca-600 hover:bg-tosca-700 disabled:opacity-50 text-white font-black rounded-2xl text-xs tracking-widest uppercase transition-all shadow-lg shadow-tosca-500/20 cursor-pointer text-center"
                  >
                    {updatingEmail ? "Menyimpan..." : "Perbarui Email"}
                  </button>
                </div>
              </form>
            </div>

            {/* Card 2: Perbarui Password */}
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-md h-full">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600">
                  <Lock size={22} />
                </div>
                <div>
                  <span className="text-pink-600 font-bold uppercase tracking-widest text-[9px]">Sandi Akses</span>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none mt-1">Perbarui Password</h2>
                </div>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Password Saat Ini</label>
                    <div className="relative">
                      <input
                        type={showPass["pass_curr"] ? "text" : "password"}
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-tosca-500 transition-all font-medium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPass("pass_curr")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPass["pass_curr"] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Password Baru</label>
                    <div className="relative">
                      <input
                        type={showPass["pass_new"] ? "text" : "password"}
                        value={passwordForm.password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                        placeholder="Min. 8 karakter"
                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-tosca-500 transition-all font-medium"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPass("pass_new")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPass["pass_new"] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Konfirmasi Password Baru</label>
                    <div className="relative">
                      <input
                        type={showPass["pass_conf"] ? "text" : "password"}
                        value={passwordForm.password_confirmation}
                        onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                        placeholder="Ulangi password baru"
                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-tosca-500 transition-all font-medium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPass("pass_conf")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPass["pass_conf"] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="w-full py-4 bg-tosca-600 hover:bg-tosca-700 disabled:opacity-50 text-white font-black rounded-2xl text-xs tracking-widest uppercase transition-all shadow-lg shadow-tosca-500/20 cursor-pointer text-center"
                  >
                    {updatingPassword ? "Menyimpan..." : "Perbarui Password"}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  );
}
