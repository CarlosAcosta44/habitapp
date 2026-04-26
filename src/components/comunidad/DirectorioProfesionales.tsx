/**
 * @file src/components/comunidad/DirectorioProfesionales.tsx
 * @description Directorio de profesionales/entrenadores en la comunidad.
 * Muestra tarjetas con foto, nombre, especialidad y botón de contacto.
 */

import type { EntrenadorPublico } from "@/types/domain/comunidad.types";

interface DirectorioProfesionalesProps {
  entrenadores: EntrenadorPublico[];
}

export function DirectorioProfesionales({ entrenadores }: DirectorioProfesionalesProps) {
  if (entrenadores.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-5">
        Directorio de Profesionales
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {entrenadores.map((e) => (
          <div
            key={e.idEntrenador}
            className="flex items-center gap-4 p-4 rounded-2xl bg-[#111827] border border-slate-800/50 hover:border-indigo-500/30 transition-all duration-300"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center overflow-hidden">
                {e.fotoPerfil ? (
                  <img src={e.fotoPerfil} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-slate-300">
                    {e.nombre.charAt(0)}{e.apellido.charAt(0)}
                  </span>
                )}
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#111827]"></div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">
                {e.nombre} {e.apellido}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {e.especialidad ?? e.certificacion ?? "Entrenador profesional"}
              </p>
            </div>

            {/* Action */}
            <button className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors">
              Conectar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
