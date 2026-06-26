export default function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <div className={`p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer ${color} flex flex-col items-center justify-center text-center`}>
      <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">{title}</p>
      <h3 className="text-5xl font-black text-gray-800 tracking-tight">{value}</h3>
    </div>
  );
}
