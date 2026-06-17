import React from 'react';
import type { LogroReal, ProximoObjetivo } from '@/types/domain/perfil.types';

interface LogrosTabProps {
  logros: LogroReal[];
  logroDestacado: LogroReal | null;
  proximoObjetivo: ProximoObjetivo;
  porcentajeObj: number;
}

export function LogrosTab({ logros, logroDestacado, proximoObjetivo, porcentajeObj }: LogrosTabProps) {
  return (
    <div>
      {/* Logro destacado */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/20 mb-6">
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-md uppercase tracking-wider">
          {logroDestacado ? "Última Insignia" : "Aún sin insignias"}
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-3">
          {logroDestacado ? logroDestacado.nombre : "¡Comienza tu aventura!"}
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-md">
          {logroDestacado ? logroDestacado.desc : "Completa retos y mantén rachas en tus hábitos para coleccionar insignias y subir de nivel."}
        </p>
        {logroDestacado && (
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 text-2xl">{logroDestacado.icono}</span>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Obtenido el</p>
                <p className="text-sm text-white font-semibold">{logroDestacado.fecha}</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl bg-[#111827] border border-slate-800/50 text-sm font-semibold text-slate-300 hover:border-slate-700 transition-colors">
              Compartir Logro
            </button>
          </div>
        )}
      </div>

      {/* Grid de logros */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {logros.map((logro) => (
          <div key={logro.id} className="p-4 rounded-2xl bg-[#111827] border border-slate-800/50 hover:border-indigo-500/30 transition-all cursor-pointer">
            <span className="text-2xl">{logro.icono}</span>
            <h3 className="text-sm font-bold text-indigo-400 mt-2">{logro.nombre}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{logro.desc}</p>
            <p className="text-[10px] text-slate-600 mt-2">{logro.fecha}</p>
          </div>
        ))}
      </div>

      {/* Próximo objetivo */}
      <div className="mt-6 p-6 rounded-2xl bg-[#111827] border border-slate-800/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">
              Próximo objetivo: <span className="text-indigo-400 italic">{proximoObjetivo.nombre}</span>
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {proximoObjetivo.desc}
            </p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider">{porcentajeObj}% Completado</p>
            <p className="text-sm font-bold text-indigo-400">{proximoObjetivo.actual}/{proximoObjetivo.meta}</p>
          </div>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
          <div className={`h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full`} style={{ width: `${porcentajeObj}%` }}></div>
        </div>
      </div>
    </div>
  );
}
