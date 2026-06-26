"use client";

import { X, Facebook, Instagram, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

interface ShareableImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  description?: string;
  tingkat?: string;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function ShareableImageModal({
  isOpen,
  onClose,
  imageUrl,
  title,
  description,
  tingkat,
  onPrev,
  onNext,
}: ShareableImageModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && onPrev) {
        onPrev();
      } else if (e.key === "ArrowRight" && onNext) {
        onNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    if (isOpen && imageUrl) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, imageUrl]);

  if (!isOpen || !imageUrl || !mounted) return null;

  const handleShare = async (platform: "instagram" | "tiktok" | "whatsapp" | "facebook") => {
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${imageUrl}` : imageUrl;
    const textToShare = `Lihat dokumentasi "${title}" dari Budiman Cendikia`;

    if (platform === "whatsapp") {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare + "\n" + shareUrl)}`;
      window.open(waUrl, "_blank");
    } else if (platform === "facebook") {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      window.open(fbUrl, "_blank");
    } else {
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: textToShare,
            url: shareUrl,
          });
          toast.success("Berhasil dibagikan!");
        } catch (err) {
          console.log("Native share failed or dismissed:", err);
        }
      } else {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.info(
            `Link gambar disalin ke clipboard! Silakan buka ${
              platform === "instagram" ? "Instagram" : "TikTok"
            } untuk membagikannya.`
          );
        } catch {
          toast.error("Gagal menyalin link gambar.");
        }
      }
    }
  };

  const getShortDescription = () => {
    if (!description || description.trim() === "") {
      return "Dokumentasi kegiatan sekolah.";
    }
    const cleanDesc = description.replace(/<[^>]*>?/gm, "").trim();
    if (cleanDesc.length > 120) {
      return cleanDesc.substring(0, 120) + "...";
    }
    return cleanDesc;
  };

  const shortDesc = getShortDescription();

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/90 overflow-y-auto animate-fade-in">
      {/* Floating close button */}
      <button 
        onClick={onClose}
        className="fixed top-6 right-6 z-[100000] text-white/70 hover:text-white hover:bg-white/10 p-2.5 rounded-full transition-colors cursor-pointer border border-white/10"
        title="Tutup"
        aria-label="Tutup"
      >
        <X size={24} />
      </button>

      {/* Floating Navigation Buttons */}
      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-[100000] text-white/70 hover:text-white hover:bg-white/10 p-2 md:p-3 rounded-full transition-all cursor-pointer border border-white/10 hover:scale-105 active:scale-95 shadow-lg shadow-black/50"
          title="Sebelumnya"
          aria-label="Sebelumnya"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      )}
      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[100000] text-white/70 hover:text-white hover:bg-white/10 p-2 md:p-3 rounded-full transition-all cursor-pointer border border-white/10 hover:scale-105 active:scale-95 shadow-lg shadow-black/50"
          title="Berikutnya"
          aria-label="Berikutnya"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      )}

      {/* Centering wrapper */}
      <div 
        className="flex min-h-full items-center justify-center p-4 cursor-pointer"
        onClick={onClose}
      >
        {/* Frameless Modal Container */}
        <div 
          className="max-w-4xl w-full bg-transparent relative cursor-default flex flex-col items-center text-center transform scale-100 transition-all duration-300 z-10 gap-6 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Judul di paling atas */}
          <div className="w-full flex flex-col items-center gap-2">
            {tingkat && (
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-white/10 text-white/70 rounded-full border border-white/10 uppercase tracking-wider">
                {tingkat}
              </span>
            )}
            <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-snug tracking-tight max-w-2xl px-4">
              {title}
            </h3>
          </div>

          {/* 2. Gambar utuh tepat di bawah judul */}
          <div className="relative w-full flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt={title} 
              className="max-h-[60vh] max-w-full object-contain rounded-lg select-none shadow-2xl"
            />
          </div>

          {/* 3. Keterangan di bawah gambar */}
          <div className="flex flex-col items-center gap-2 max-w-2xl px-4">
            <p className="text-sm md:text-base text-white/80 font-normal leading-relaxed">
              {shortDesc}
            </p>
            <p className="text-sm text-white/40 font-bold tracking-widest leading-none">
              .....
            </p>
          </div>

          {/* 4. Ikon Bagikan di paling bawah */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {/* WhatsApp */}
            <button 
              onClick={() => handleShare("whatsapp")}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#25D366]/20 text-white/80 hover:text-[#25D366] flex items-center justify-center transition-all border border-white/15 hover:border-[#25D366]/30 shadow-md hover:scale-105 cursor-pointer"
              title="WhatsApp"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.5.003 9.985-4.479 9.988-9.98.002-2.665-1.033-5.17-2.915-7.054C16.48 1.705 13.984.665 11.968.665c-5.503 0-9.99 4.48-9.993 9.982-.001 1.83.5 3.613 1.447 5.18l-1.01 3.692 3.805-.997c1.554.847 3.09 1.282 3.84 1.282zM17.51 14.19c-.3-.15-1.782-.88-2.03-.967-.25-.09-.43-.13-.61.13-.18.27-.69.88-.85 1.05-.15.18-.3.2-.6.05-1.73-.85-2.88-1.5-4.03-3.47-.3-.52.3-.48.85-1.58.09-.18.05-.33-.02-.48-.07-.15-.61-1.47-.84-2.01-.22-.53-.44-.45-.61-.46l-.52-.01c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27s.98 2.62 1.11 2.8c.14.18 1.93 2.95 4.67 4.14.65.28 1.16.45 1.56.57.66.21 1.25.18 1.73.11.53-.08 1.78-.73 2.03-1.43.25-.7.25-1.29.17-1.42-.08-.13-.3-.21-.6-.36z"/>
              </svg>
            </button>

            {/* Instagram */}
            <button 
              onClick={() => handleShare("instagram")}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#ee2a7b]/20 text-white/80 hover:text-[#ee2a7b] flex items-center justify-center transition-all border border-white/15 hover:border-[#ee2a7b]/30 shadow-md hover:scale-105 cursor-pointer"
              title="Instagram"
            >
              <Instagram size={20} />
            </button>

            {/* TikTok */}
            <button 
              onClick={() => handleShare("tiktok")}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-all border border-white/15 hover:border-white/20 shadow-md hover:scale-105 cursor-pointer"
              title="TikTok"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.86.95 2 1.63 3.25 1.94v3.97c-1.39-.02-2.77-.38-3.99-1.07-.76-.43-1.42-.99-1.96-1.66v7.32c.04 1.72-.41 3.43-1.3 4.88-1.52 2.51-4.22 3.99-7.14 4.01-2.91.02-5.69-1.37-7.29-3.81-1.67-2.52-1.92-5.78-.66-8.52 1.13-2.47 3.45-4.18 6.16-4.48.33-.04.66-.05.99-.04v4.03c-.22.01-.44.03-.66.07-1.32.22-2.42 1.09-2.92 2.33-.61 1.51-.25 3.26.93 4.39.92.88 2.21 1.25 3.44.97 1.41-.33 2.49-1.49 2.72-2.92.05-.28.07-.56.07-.84V0h-.01z"/>
              </svg>
            </button>

            {/* Facebook */}
            <button 
              onClick={() => handleShare("facebook")}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#1877F2]/20 text-white/80 hover:text-[#1877F2] flex items-center justify-center transition-all border border-white/15 hover:border-[#1877F2]/30 shadow-md hover:scale-105 cursor-pointer"
              title="Facebook"
            >
              <Facebook size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}


