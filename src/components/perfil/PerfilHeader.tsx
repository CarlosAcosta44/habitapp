import React from 'react';
import Link from 'next/link';
import { Edit2 } from 'lucide-react';

interface PerfilHeaderProps {
  perfil: {
    nombre: string;
    apellido: string;
    fotoperfil: string | null;
    puntos: number;
  } | null;
  rachaGlobal: number;
}

export function PerfilHeader({ perfil, rachaGlobal }: PerfilHeaderProps) {
  const nombre = perfil?.nombre ?? "Usuario";
  const apellido = perfil?.apellido ?? "";
  const puntos = perfil?.puntos ?? 0;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
      {/* Avatar */}
      <div className="relative">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500/30 ring-4 ring-indigo-500/10 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          {perfil?.fotoperfil ? (
            <img src={perfil.fotoperfil} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-4xl font-bold text-slate-300 uppercase">
              {nombre.charAt(0)}{apellido.charAt(0)}
            </span>
          )}
        </div>
        <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-emerald-500 border-3 border-[#080b14] flex items-center justify-center">
          <span className="text-xs">✓</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 relative">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-white">
            {nombre} {apellido}
          </h1>
          <Link href="/ajustes" className="p-2 bg-[#111827] hover:bg-slate-800 rounded-full border border-slate-700/50 text-slate-400 hover:text-indigo-400 transition-colors" title="Editar Perfil">
            <Edit2 className="w-5 h-5" />
          </Link>
        </div>
        <p className="text-sm text-slate-400 italic mt-1">
          &ldquo;Construyendo el futuro, un hábito a la vez.&rdquo;
        </p>
        <div className="flex items-center gap-3 mt-3">
          <span className="px-4 py-1.5 rounded-xl bg-[#111827] border border-slate-800/50 text-sm font-semibold text-indigo-400">
            {puntos.toLocaleString()} <span className="text-slate-500 text-xs uppercase tracking-wider">Puntos</span>
          </span>
          <span className="px-4 py-1.5 rounded-xl bg-[#111827] border border-slate-800/50 text-sm font-semibold text-orange-400">
            {rachaGlobal} <span className="text-slate-500 text-xs uppercase tracking-wider">Racha</span>
          </span>
        </div>
      </div>
    </div>
  );
}
