"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import ProgramFasilitasList from "@/components/ProgramFasilitasList";
import ProgramFasilitasForm from "@/components/ProgramFasilitasForm";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";

interface ProgramFasilitas {
  id: number;
  nama: string;
  deskripsi: string | null;
  ikon: string | null;
  url: string | null;
  unit: string;
}

export default function ProgramFasilitasAdminPage() {
  const params = useParams();
  const unit = params.unit as "sd" | "smp";
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingItem, setEditingItem] = useState<ProgramFasilitas | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const savedUnit = localStorage.getItem("admin_unit");
    if (token && savedUnit === unit) {
      setIsAdmin(true);
    }
  }, [unit]);

  const handleEdit = (item: ProgramFasilitas) => {
    setEditingItem(item);
    setView("form");
  };

  const handleSuccess = () => {
    setView("list");
    setEditingItem(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setView("list");
    setEditingItem(null);
  };

  return (
    <AdminLayout unit={unit} title={`Manajemen Program & Fasilitas ${unit.toUpperCase()}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            {view === "list" ? "Daftar Program & Fasilitas" : (editingItem ? "Edit Item" : "Tambah Item Baru")}
          </h2>
          <p className="text-gray-400 font-medium">
            {view === "list" 
              ? `Kelola semua program unggulan dan fasilitas unit ${unit.toUpperCase()}.` 
              : "Isi formulir di bawah ini dengan lengkap."}
          </p>
        </div>
        {isAdmin && view === "list" && (
          <button 
            onClick={() => {setEditingItem(null); setView("form")}}
            className="bg-tosca-500 hover:bg-tosca-700 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-lg shadow-tosca-500/20 flex items-center gap-3 hover:-translate-y-1"
          >
            <Plus size={18} /> Tambah Item
          </button>
        )}
      </div>

      {view === "list" ? (
        <ProgramFasilitasList key={refreshKey} unit={unit} onEdit={handleEdit} />
      ) : (
        <ProgramFasilitasForm 
          unit={unit} 
          initialData={editingItem} 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      )}
    </AdminLayout>
  );
}
