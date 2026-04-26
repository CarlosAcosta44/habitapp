/**
 * @file src/components/entrenador/RutinaForm.tsx
 * @description Formulario para crear una rutina.
 * @directive "use client"
 */

"use client";

import { useActionState } from "react";
import { createRutinaAction } from "@/actions/entrenador.actions";

export function RutinaForm() {
  const [state, formAction, isPending] = useActionState(
    createRutinaAction,
    null
  );

  return (
    <form action={formAction} className="space-y-4">

      {/* Tipo */}
      <div>
        <label
          htmlFor="tipo"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Tipo de rutina *
        </label>
        <input
          id="tipo"
          name="tipo"
          type="text"
          required
          placeholder="Ej: Cardio, Fuerza, Flexibilidad"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
        />
        {state?.errors?.tipo && (
          <p className="mt-1 text-xs text-red-500">{state.errors.tipo[0]}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label
          htmlFor="descripcion-rutina"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Descripción
        </label>
        <textarea
          id="descripcion-rutina"
          name="descripcion"
          rows={3}
          placeholder="Describe la rutina..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 resize-none"
        />
      </div>

      {/* Fila: Duración + Nivel */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="duracion"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Duración (min)
          </label>
          <input
            id="duracion"
            name="duracion"
            type="number"
            min={1}
            placeholder="30"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label
            htmlFor="nivel"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Nivel *
          </label>
          <select
            id="nivel"
            name="nivel"
            required
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
          >
            <option value="">Seleccionar</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
          {state?.errors?.nivel && (
            <p className="mt-1 text-xs text-red-500">{state.errors.nivel[0]}</p>
          )}
        </div>
      </div>

      {/* Objetivo */}
      <div>
        <label
          htmlFor="objetivo"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Objetivo
        </label>
        <input
          id="objetivo"
          name="objetivo"
          type="text"
          placeholder="¿Qué se busca lograr?"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
        />
      </div>

      {/* Mensaje feedback */}
      {state && !state.success && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
        </div>
      )}
      {state?.success && (
        <div className="rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 p-3">
          <p className="text-sm text-green-600 dark:text-green-400">{state.message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 text-sm transition-colors"
      >
        {isPending ? "Creando rutina..." : "Crear rutina"}
      </button>
    </form>
  );
}