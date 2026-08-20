/**
 * @file src/components/habitos/HabitForm.tsx
 * @description Formulario para crear un nuevo hábito.
 * Usa useActionState para manejar el estado del Server Action.
 *
 * @directive "use client"
 */

"use client";

import { useActionState } from "react";
import { createHabitoAction } from "@/actions/habito.actions";
import type { CategoriaHabito } from "@/types/domain/habito.types";

interface HabitFormProps {
  categorias: CategoriaHabito[];
}

export function HabitForm({ categorias }: HabitFormProps) {
  const [state, formAction, isPending] = useActionState(
    createHabitoAction,
    null
  );

  const hoy = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction} className="space-y-5">

      {/* Nombre */}
      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Nombre del hábito *
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          placeholder="Ej: Beber 2 litros de agua"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {state?.errors?.nombre && (
          <p className="mt-1 text-xs text-red-500">{state.errors.nombre[0]}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label
          htmlFor="descripcion"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={2}
          placeholder="¿Por qué quieres este hábito?"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      {/* Categoría */}
      <div>
        <label
          htmlFor="idCategoria"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Categoría *
        </label>
        <select
          id="idCategoria"
          name="idCategoria"
          required
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.idCategoria} value={cat.idCategoria}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {state?.errors?.idCategoria && (
          <p className="mt-1 text-xs text-red-500">{state.errors.idCategoria[0]}</p>
        )}
      </div>

      {/* Fila: Fecha inicio + Fecha fin */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="fechaInicio"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Fecha inicio *
          </label>
          <input
            id="fechaInicio"
            name="fechaInicio"
            type="date"
            required
            defaultValue={hoy}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="fechaFin"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Fecha fin
          </label>
          <input
            id="fechaFin"
            name="fechaFin"
            type="date"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Puntos */}
      <div>
        <label
          htmlFor="puntos"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Puntos por completar (1-100) *
        </label>
        <input
          id="puntos"
          name="puntos"
          type="number"
          required
          min={1}
          max={100}
          defaultValue={10}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {state?.errors?.puntos && (
          <p className="mt-1 text-xs text-red-500">{state.errors.puntos[0]}</p>
        )}
      </div>

      {/* Mensaje de error general */}
      {state && !state.success && !state.errors && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
        </div>
      )}

      {/* Mensaje de éxito */}
      {state?.success && (
        <div className="rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3">
          <p className="text-sm text-green-600 dark:text-green-400">{state.message}</p>
        </div>
      )}

      {/* Botón submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm transition-colors"
      >
        {isPending ? "Creando hábito..." : "Crear hábito ✨"}
      </button>
    </form>
  );
}