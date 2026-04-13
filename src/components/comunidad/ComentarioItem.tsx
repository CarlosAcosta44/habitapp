/**
 * @file src/components/comunidad/ComentarioItem.tsx
 * @description Comentario con autor, reacciones y respuestas anidadas.
 * @directive "use client"
 */

"use client";

import { useState, useTransition } from "react";
import { reaccionarAction }        from "@/modules/comunidad/comunidad.actions";
import { ComentarioForm }          from "./ComentarioForm";
import type { ComentarioConAutor } from "@/modules/comunidad/types";

interface ComentarioItemProps {
  comentario: ComentarioConAutor;
  foroId:     string;
  esRespuesta?: boolean;
}

export function ComentarioItem({
  comentario,
  foroId,
  esRespuesta = false,
}: ComentarioItemProps) {
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [isPending, startTransition]            = useTransition();

  function handleReaccion(tipo: "Me gusta" | "Me motiva" | "Util") {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("tipo",         tipo);
      formData.set("idComentario", comentario.idComentario);
      await reaccionarAction(null, formData);
    });
  }

  return (
    <div className={`${esRespuesta ? "ml-8 border-l-2 border-slate-200 dark:border-slate-700 pl-4" : ""}`}>
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 space-y-3">

        {/* Autor + fecha */}
        <div className="flex items-center gap-3">
          {/* Avatar inicial */}
          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {comentario.autor.nombre.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {comentario.autor.nombre} {comentario.autor.apellido}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {new Date(comentario.fechaPublicacion).toLocaleDateString("es-CO")}
            </p>
          </div>
        </div>

        {/* Contenido */}
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {comentario.contenido}
        </p>

        {/* Reacciones + Responder */}
        <div className="flex items-center gap-3 pt-1">
          {(["Me gusta", "Me motiva", "Util"] as const).map((tipo) => {
            const emoji = tipo === "Me gusta" ? "👍" : tipo === "Me motiva" ? "💪" : "💡";
            const count = tipo === "Me gusta"
              ? comentario.reacciones.meGusta
              : tipo === "Me motiva"
                ? comentario.reacciones.meMotiva
                : comentario.reacciones.util;

            return (
              <button
                key={tipo}
                id={`reaccion-${tipo.replace(" ", "-")}-${comentario.idComentario}`}
                onClick={() => handleReaccion(tipo)}
                disabled={isPending}
                aria-label={`Reaccionar con ${tipo}`}
                className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-50"
              >
                {emoji} {count > 0 && count}
              </button>
            );
          })}

          {/* Botón responder (solo en comentarios padre) */}
          {!esRespuesta && (
            <button
              id={`responder-${comentario.idComentario}`}
              onClick={() => setMostrarRespuesta(!mostrarRespuesta)}
              aria-label="Responder comentario"
              className="ml-auto text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {mostrarRespuesta ? "Cancelar" : "↩ Responder"}
            </button>
          )}
        </div>

        {/* Formulario de respuesta */}
        {mostrarRespuesta && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <ComentarioForm
              foroId={foroId}
              idComentarioPadre={comentario.idComentario}
              placeholder="Escribe tu respuesta..."
            />
          </div>
        )}
      </div>

      {/* Respuestas anidadas */}
      {comentario.respuestas.length > 0 && (
        <div className="mt-3 space-y-3">
          {comentario.respuestas.map((respuesta) => (
            <ComentarioItem
              key={respuesta.idComentario}
              comentario={respuesta}
              foroId={foroId}
              esRespuesta
            />
          ))}
        </div>
      )}
    </div>
  );
}