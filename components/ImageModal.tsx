"use client";

import { X, Download, Share2, Link2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
}

export default function ImageModal({ isOpen, onClose, imageUrl, title }: ImageModalProps) {
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

  if (!isOpen || !imageUrl) return null;

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const urlGambar = imageUrl;
    navigator.clipboard.writeText(urlGambar).then(() => {
      alert('Link foto berhasil disalin!');
    }).catch((err) => {
      console.error("Gagal menyalin link:", err);
    });
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(imageUrl).then(() => {
      toast.success("Link berhasil disalin!");
    }).catch(() => {
      toast.error("Gagal menyalin link.");
    });
  };

  const handleClose = (e: React.MouseEvent) => {
    try {
      if (e) {
        e.stopPropagation();
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Gagal menutup modal pratinjau gambar:", err);
    }
  };

  return (
    <div className="modal animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" 
        onClick={handleClose}
      ></div>
      
      <div className="modal-content animate-zoom-in" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={handleClose}
          className="close p-2 bg-black/40 hover:bg-black/75 text-white rounded-full transition-colors border border-white/10"
          title="Tutup"
          aria-label="Tutup"
        >
          <X size={22} />
        </button>

        <img 
          src={imageUrl || ""} 
          alt={title || "Full preview"} 
          className="select-none shadow-2xl rounded-2xl max-h-[80vh] object-contain mx-auto"
          onError={(e) => {
            try {
              const target = e.currentTarget;
              if (target) {
                target.style.display = "none";
              }
            } catch (err) {
              console.error("Gagal menangani error load gambar modal:", err);
            }
          }}
        />

        {imageUrl && (
          <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
            <a 
              href={imageUrl} 
              download 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors border border-white/10"
              title="Download Gambar"
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={16} />
            </a>
            
            <button 
              onClick={handleShareClick}
              className="p-2 bg-green-600/70 hover:bg-green-600 text-white rounded-full transition-colors border border-white/10"
              title="Bagikan Foto (Salin Link)"
            >
              <Share2 size={16} />
            </button>

            <button 
              onClick={handleCopyLink}
              className="p-2 bg-blue-600/70 hover:bg-blue-600 text-white rounded-full transition-colors border border-white/10"
              title="Salin Link Gambar"
            >
              <Link2 size={16} />
            </button>

            {title && (
              <span className="px-3 py-1.5 bg-black/50 text-white text-xs font-bold rounded-xl border border-white/10 flex items-center max-w-[250px] truncate">
                {title}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

