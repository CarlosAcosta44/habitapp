/**
 * @file src/actions/amigos.actions.ts
 * @description Server Actions para el módulo de Amigos.
 * @layer Presentation (Capa 1 — Server-side)
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/require-user";
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
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };
  const user = userResult.data;

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

  const result = await service.addFriend(validation.data.targetUserId);
  if (!result.success) return { success: false, message: result.error };

  revalidatePath("/perfil");
  return { success: true, message: "Amigo agregado correctamente" };
}
