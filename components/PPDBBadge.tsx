import React from "react";

interface PPDBBadgeProps {
  year?: string;
  theme?: "sd" | "smp";
}

export default function PPDBBadge({ year = "2026/2027", theme = "sd" }: PPDBBadgeProps) {
  const isSD = theme === "sd";
  const bgColor = isSD ? "bg-white" : "bg-tosca-900 text-white";
  const borderColor = isSD ? "border border-tosca-100 shadow-sm" : "shadow-lg";
  const dotColor = isSD ? "bg-tosca-500" : "bg-tosca-200";
  const textColor = isSD ? "text-tosca-700" : "text-white";

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${bgColor} ${borderColor} mb-6`}>
      <span className={`w-2 h-2 rounded-full ${dotColor} animate-pulse shadow-sm`}></span>
      <span className={`text-[10px] font-black uppercase tracking-widest ${textColor}`}>
        Pendaftaran Siswa Baru {year}
      </span>
    </div>
  );
}
