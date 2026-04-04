/**
 * @file src/components/comunidad/ComentarioForm.tsx
 * @description Formulario para escribir un comentario o respuesta.
 * @directive "use client"
 */

"use client";

import { useActionState } from "react";
import { comentarAction } from "@/modules/comunidad/comunidad.actions";

interface ComentarioFormProps {
  foroId:            string;
  idComentarioPadre?: string;
  placeholder?:      string;
}

export function ComentarioForm({
  foroId,
  idComentarioPadre,
  placeholder = "Escribe tu comentario...",
}: ComentarioFormProps) {
  const [state, formAction, isPending] = useActionState(comentarAction, null);

  return (
    <form action={formAction} className="space-y-3">
      {/* Campos ocultos */}
      <input type="hidden" name="foroId" value={foroId} />
      {idComentarioPadre && (
        <input type="hidden" name="idComentarioPadre" value={idComentarioPadre} />
      )}

      <textarea
        name="contenido"
        rows={idComentarioPadre ? 2 : 3}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
      />
      {state?.errors?.contenido && (
        <p className="text-xs text-red-500">{state.errors.contenido[0]}</p>
      )}

      <div className="flex items-center justify-between">
        {state && !state.success && (
          <p className="text-xs text-red-500">{state.message}</p>
        )}
        {state?.success && (
          <p className="text-xs text-green-500">{state.message}</p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="ml-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 transition-colors"
        >
          {isPending
            ? "Publicando..."
            : idComentarioPadre
              ? "Responder"
              : "Comentar"
          }
        </button>
      </div>
    </form>
  );
}