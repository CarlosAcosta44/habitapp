/**
 * @file src/components/comunidad/ForoCard.tsx
 * @description Tarjeta de foro con métricas y botón de suscripción.
 */

"use client";

import Link              from "next/link";
import { useTransition } from "react";
import { suscribirseAction, desuscribirseAction } from "@/actions/comunidad.actions";
import type { ForoConMetricas } from "@/types/domain/comunidad.types";

interface ForoCardProps {
  foro: ForoConMetricas;
}

export function ForoCard({ foro }: ForoCardProps) {
  const [isPending, startTransition] = useTransition();

  function handleSuscripcion() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("foroId", foro.idForo);

      if (foro.estasSuscrito) {
        await desuscribirseAction(null, formData);
      } else {
        await suscribirseAction(null, formData);
      }
    });
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 space-y-3 hover:shadow-md transition-shadow">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/dashboard/comunidad/foros/${foro.idForo}`}
          className="flex-1 min-w-0"
        >
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate">
            {foro.titulo}
          </h3>
          {foro.categoria && (
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              {foro.categoria}
            </span>
          )}
        </Link>

        {/* Estado */}
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
          foro.estado === "Abierto"
            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
        }`}>
          {foro.estado}
        </span>
      </div>

      {/* Descripción */}
      {foro.descripcion && (
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {foro.descripcion}
        </p>
      )}

      {/* Footer: métricas + suscripción */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
          <span>💬 {foro.totalComentarios}</span>
          <span>👥 {foro.totalSuscriptores}</span>
        </div>

        <button
          id={`suscribir-foro-${foro.idForo}`}
          onClick={handleSuscripcion}
          disabled={isPending}
          aria-label={foro.estasSuscrito ? "Desuscribirse del foro" : "Suscribirse al foro"}
          className={`
            text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors
            ${foro.estasSuscrito
              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-200"
              : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600"
            }
            ${isPending ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {isPending
            ? "..."
            : foro.estasSuscrito
              ? "✓ Suscrito"
              : "+ Suscribirse"
          }
        </button>
      </div>
    </div>
  );
}