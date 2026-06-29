import React from 'react';
import type { AmigoReal, SugerenciaAmigo } from '@/types/domain/perfil.types';
import { AddFriendForm } from './AddFriendForm';

interface AmigosTabProps {
  amigos: AmigoReal[];
  sugerenciasAmigos: SugerenciaAmigo[];
}

export function AmigosTab({ amigos, sugerenciasAmigos }: AmigosTabProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">{amigos.length} Amigos</h2>
          <p className="text-sm text-slate-400 italic">Tu red de apoyo para mejores hábitos.</p>
        </div>
      </div>

      <AddFriendForm suggestions={sugerenciasAmigos} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {amigos.map((amigo) => (
          <div key={amigo.id} className={`p-4 rounded-2xl border transition-all hover:border-indigo-500/30 ${
            amigo.top
              ? "bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border-indigo-500/30"
              : "bg-[#111827] border-slate-800/50"
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-slate-300">
                  {(amigo.nombre || '?').charAt(0)}{(amigo.apellido || '').charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{amigo.nombre || 'Sin Nombre'}</p>
                <p className="text-sm text-slate-400">{amigo.apellido || ''}</p>
                <p className="text-xs text-indigo-400 font-semibold">
                  {(amigo.puntos ?? 0).toLocaleString()} Pts
                </p>
              </div>
              {amigo.top && (
                <span className="ml-auto text-yellow-400">⭐</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <button className="px-8 py-3 rounded-xl bg-[#111827] border border-slate-800/50 text-sm font-medium text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors">
          Ver más amigos
        </button>
      </div>
    </div>
  );
}
