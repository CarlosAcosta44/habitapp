"use client";

import { useActionState } from "react";
import { addFriendAction } from "@/actions/amigos.actions";
import type { ActionState } from "@/actions/habito.actions";

interface SuggestedFriend {
  id: string;
  nombre: string;
  apellido: string;
}

interface AddFriendFormProps {
  suggestions: SuggestedFriend[];
}

export function AddFriendForm({ suggestions }: AddFriendFormProps) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    addFriendAction,
    null
  );

  return (
    <div className="space-y-3">
      <form action={formAction} className="flex items-center gap-2">
        <select
          name="targetUserId"
          required
          className="flex-1 rounded-xl bg-[#111827] border border-slate-800/50 text-sm text-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          defaultValue=""
        >
          <option value="" disabled>
            Selecciona un usuario
          </option>
          {suggestions.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nombre} {user.apellido}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending || suggestions.length === 0}
          className="px-4 py-2.5 rounded-xl bg-[#111827] border border-slate-800/50 text-sm font-semibold text-indigo-400 hover:border-indigo-500/30 transition-colors disabled:opacity-50"
        >
          {isPending ? "Agregando..." : "Añadir amigo"}
        </button>
      </form>

      {state?.message && (
        <p className={`text-xs ${state.success ? "text-emerald-400" : "text-red-400"}`}>
          {state.message}
        </p>
      )}
    </div>
  );
}
