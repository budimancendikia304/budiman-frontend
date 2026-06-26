"use client";

import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-toastify";

export default function AdminHeadmasterEdit() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";

  const [headmaster, setHeadmaster] = useState({
    name: "",
    greeting: "",
    photo: null as string | null,
  });
  const [headmasterName, setHeadmasterName] = useState("");
  const [headmasterGreeting, setHeadmasterGreeting] = useState("");
  const [headmasterPhotoFile, setHeadmasterPhotoFile] = useState<File | null>(null);
  const [isUpdatingHeadmaster, setIsUpdatingHeadmaster] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cropper states and refs
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropCoords, setCropCoords] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [libraryReady, setLibraryReady] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const cropperInstanceRef = useRef<any>(null);

  // Load Cropper.js from CDN dynamically
  useEffect(() => {
    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css";
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js";
    script.async = true;
    script.onload = () => {
      setLibraryReady(true);
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!unit) return;

    const fetchHeadmasterData = async () => {
      try {
        setLoading(true);
        const headmasterRes = await api.get(`/headmaster?unit=${unit}`);
        setHeadmaster(headmasterRes.data);
        setHeadmasterName(headmasterRes.data.name || "");
        setHeadmasterGreeting(headmasterRes.data.greeting || "");
      } catch (e) {
        console.error("Gagal memuat data kepala sekolah:", e);
        toast.error("Gagal memuat data kepala sekolah.");
      } finally {
        setLoading(false);
      }
    };

    fetchHeadmasterData();
  }, [unit]);

  // Handle cropper initialization
  useEffect(() => {
    if (showCropper && imageRef.current && selectedImage && libraryReady && (window as any).Cropper) {
      if (cropperInstanceRef.current) {
        cropperInstanceRef.current.destroy();
      }

      const CropperClass = (window as any).Cropper;
      cropperInstanceRef.current = new CropperClass(imageRef.current, {
        aspectRatio: 3 / 4,
        viewMode: 1,
        autoCropArea: 1.0,
        responsive: true,
        restore: false,
        checkCrossOrigin: false,
        crop(event: any) {
          const data = event.detail;
          setCropCoords({
            x: Math.round(data.x),
            y: Math.round(data.y),
            width: Math.round(data.width),
            height: Math.round(data.height),
          });
        }
      });
    }

    return () => {
      if (cropperInstanceRef.current) {
        cropperInstanceRef.current.destroy();
        cropperInstanceRef.current = null;
      }
    };
  }, [showCropper, selectedImage, libraryReady]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setHeadmasterPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCrop = () => {
    if (cropperInstanceRef.current) {
      const canvas = cropperInstanceRef.current.getCroppedCanvas({
        width: 300,
        height: 400
      });
      setCroppedPreview(canvas.toDataURL());
      setShowCropper(false);
    }
  };

  const handleHeadmasterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdatingHeadmaster(true);
      const formData = new FormData();
      formData.append("unit", unit);
      formData.append("name", headmasterName);
      formData.append("greeting", headmasterGreeting);
      if (headmasterPhotoFile) {
        formData.append("photo", headmasterPhotoFile);
        formData.append("crop_x", String(cropCoords.x));
        formData.append("crop_y", String(cropCoords.y));
        formData.append("crop_width", String(cropCoords.width));
        formData.append("crop_height", String(cropCoords.height));
      }

      const res = await api.post("/headmaster/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Sambutan kepala sekolah berhasil diperbarui!");
      if (res.data.data) {
        setHeadmaster(res.data.data);
        setCroppedPreview(null);
        setSelectedImage(null);
        setHeadmasterPhotoFile(null);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal memperbarui sambutan.");
    } finally {
      setIsUpdatingHeadmaster(false);
    }
  };

  const getPhotoUrl = () => {
    if (croppedPreview) {
      return croppedPreview;
    }
    if (headmaster.photo) {
      const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL 
        ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '') 
        : 'http://localhost:8000';
      return `${backendBaseUrl}/uploads/kepala_sekolah/${headmaster.photo}`;
    }
    return null;
  };

  return (
    <AdminLayout unit={unit} title={`Edit Profil Kepala Sekolah ${unit.toUpperCase()}`}>
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2 text-wrap">Kelola Profil Kepala Sekolah</h2>
          <p className="text-gray-500 font-medium">Ubah nama, sambutan hangat, dan potong foto profil Kepala Sekolah untuk unit {unit.toUpperCase()}.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-tosca-500 border-gray-200"></div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <form onSubmit={handleHeadmasterSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nama Kepala Sekolah</label>
                  <input 
                    type="text" 
                    value={headmasterName}
                    onChange={(e) => setHeadmasterName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-medium"
                    placeholder="Nama Lengkap beserta gelar..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Kalimat Sambutan</label>
                  <textarea 
                    value={headmasterGreeting}
                    onChange={(e) => setHeadmasterGreeting(e.target.value)}
                    required
                    rows={10}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-tosca-500 font-medium"
                    placeholder="Tulis sambutan kepala sekolah di sini..."
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Foto Kepala Sekolah</label>
                  <div className="mt-1 flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-[32px] hover:border-tosca-500 transition-colors">
                    {getPhotoUrl() ? (
                      <div className="relative w-32 h-40 rounded-2xl overflow-hidden mb-4 shadow-md bg-gray-100">
                        <img 
                          src={getPhotoUrl() || ""} 
                          alt="Foto Kepala Sekolah" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-40 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center p-4 mb-4 border">
                        Belum Ada Foto
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-tosca-50 file:text-tosca-700 hover:file:bg-tosca-100 cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-400 font-bold mt-2">JPEG, PNG, JPG maks. 2MB</p>
                  </div>
                </div>

                {/* On-page Cropper Area */}
                {showCropper && selectedImage && (
                  <div className="border border-dashed border-gray-300 rounded-[32px] overflow-hidden p-6 bg-gray-50 flex flex-col items-center">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Sesuaikan Area Potong</h4>
                    <div className="w-full max-h-[300px] overflow-hidden flex items-center justify-center bg-gray-100 rounded-2xl border">
                      <img 
                        ref={imageRef} 
                        src={selectedImage} 
                        alt="Crop source" 
                        style={{ display: "block", maxWidth: "100%", maxHeight: "250px" }} 
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={handleApplyCrop} 
                      className="mt-4 w-full py-3 bg-tosca-500 hover:bg-tosca-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Terapkan Potongan
                    </button>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isUpdatingHeadmaster || showCropper}
                  className="w-full py-4 bg-tosca-500 hover:bg-tosca-700 text-white rounded-2xl font-black transition-all shadow-lg shadow-tosca-500/20 disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  {isUpdatingHeadmaster ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
