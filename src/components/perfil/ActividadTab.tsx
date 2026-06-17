import React from 'react';
import type { ActividadItem } from '@/types/domain/perfil.types';

interface ActividadTabProps {
  actividad: ActividadItem[];
}

export function ActividadTab({ actividad }: ActividadTabProps) {
  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4">Último Mes</h2>
      <div className="space-y-3">
        {actividad.map((item) => (
          <div key={item.id} className={`p-4 rounded-2xl border-l-4 ${item.color} border border-slate-800/30`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-lg flex-shrink-0">
                {item.icono}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold text-white">{item.titulo}</h3>
                  {item.puntos > 0 && (
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-base font-bold text-indigo-400">+{item.puntos}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.label}</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                {item.extra && (
                  <p className={`text-xs mt-2 font-medium ${
                    item.tipo === "racha_rota" ? "text-red-400" : "text-emerald-400"
                  }`}>
                    {item.extra}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
