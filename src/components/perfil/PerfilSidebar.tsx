import React from 'react';
import Link from 'next/link';
import type { AmigoReal, ProximoObjetivo } from '@/types/domain/perfil.types';

interface PerfilSidebarProps {
  diasActivosMensuales: number;
  diasEnElMes: number;
  eficienciaMensual: number;
  proximoObjetivo: ProximoObjetivo;
  amigos: AmigoReal[];
}

export function PerfilSidebar({
  diasActivosMensuales,
  diasEnElMes,
  eficienciaMensual,
  proximoObjetivo,
  amigos,
}: PerfilSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Rendimiento Mensual */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/50">
        <h3 className="text-base font-bold text-white mb-3">Rendimiento Mensual</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Días activos vs meta</span>
          <span className="text-sm font-bold text-indigo-400">{diasActivosMensuales}/{diasEnElMes}</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${eficienciaMensual}%` }}></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-800/50 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Días Activos</p>
            <p className="text-xl font-extrabold text-white">{diasActivosMensuales}/{diasEnElMes}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Eficiencia</p>
            <p className="text-xl font-extrabold text-white">{eficienciaMensual}%</p>
          </div>
        </div>
      </div>

      {/* Próximo Hito */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-violet-900/30 border border-indigo-500/20">
        <div className="flex items-start justify-between">
          <p className="text-[10px] text-indigo-300 uppercase tracking-wider font-bold">Próximo Hito</p>
          <span className="text-2xl">🏅</span>
        </div>
        <h3 className="text-xl font-extrabold text-white mt-2">{proximoObjetivo.nombre}</h3>
        <p className="text-xs text-slate-300 mt-1">
          Rumbo a los {proximoObjetivo.meta} puntos totales.
        </p>
      </div>

      {/* Círculo Social */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/50">
        <h3 className="text-base font-bold text-white mb-3">Círculo Social</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex -space-x-2">
            {amigos.slice(0, 3).map((a, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-[#111827] flex items-center justify-center">
                <span className="text-[10px] text-slate-300 font-medium">{(a.nombre || '?').charAt(0)}</span>
              </div>
            ))}
            {amigos.length === 0 && <span className="text-xs text-slate-500">Aún no tienes amigos</span>}
          </div>
          {amigos.length > 0 && <span className="text-xs text-slate-400">{amigos.length} amigos en tu red</span>}
        </div>
        <Link 
          href="/ranking"
          className="block flex items-center justify-center w-full py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          Ver Rankings
        </Link>
      </div>
    </div>
  );
}
