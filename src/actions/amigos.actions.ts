/**
 * @file src/actions/amigos.actions.ts
 * @description Server Actions para el módulo de Amigos.
 * @layer Presentation (Capa 1 — Server-side)
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { AmigosService } from "@/services/amigos.service";
import type { ActionState } from "@/actions/habito.actions";

const service = new AmigosService();

const AddFriendSchema = z.object({
  targetUserId: z.string().uuid("Usuario inválido"),
});

export async function addFriendAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return { success: false, message: "No autorizado" };

  const validation = AddFriendSchema.safeParse({
    targetUserId: formData.get("targetUserId"),
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Selecciona un usuario válido",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await service.addFriend(session.user.id, validation.data.targetUserId);
  if (!result.success) return { success: false, message: result.error };

  revalidatePath("/perfil");
  return { success: true, message: "Amigo agregado correctamente" };
}
