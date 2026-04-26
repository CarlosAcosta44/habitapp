/**
 * @file src/actions/comunidad.actions.ts
 * @description Server Actions para el módulo de Comunidad.
 * @layer Presentation (Capa 1 — Server-side)
 */

"use server";

import { revalidatePath } from "next/cache";
import { z }              from "zod";
import { createClient }   from "@/lib/supabase/server";
import { ComunidadService } from "@/services/comunidad.service";
import type { ActionState } from "@/actions/habito.actions";

const service = new ComunidadService();

// ─── Schemas ──────────────────────────────────────────────────────────────────
const ComentarSchema = z.object({
  foroId:            z.string().uuid("Foro inválido"),
  contenido:         z.string()
                      .min(1,   "El comentario no puede estar vacío")
                      .max(500, "Máximo 500 caracteres"),
  idComentarioPadre: z.string().uuid().optional(),
});

const ReaccionSchema = z.object({
  tipo:         z.enum(["Me gusta", "Me motiva", "Util"]),
  idComentario: z.string().uuid().optional(),
  idArticulo:   z.string().uuid().optional(),
});

const SuscripcionSchema = z.object({
  foroId: z.string().uuid("Foro inválido"),
});

// ─── comentarAction ───────────────────────────────────────────────────────────
export async function comentarAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, message: "No autorizado" };

  const rawData = {
    foroId:            formData.get("foroId"),
    contenido:         formData.get("contenido"),
    idComentarioPadre: formData.get("idComentarioPadre") || undefined,
  };

  const validation = ComentarSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrige los errores",
      errors:  validation.error.flatten().fieldErrors,
    };
  }

  const result = await service.comentar({
    contenido:         validation.data.contenido,
    idComentarioPadre: validation.data.idComentarioPadre ?? null,
    idForo:            validation.data.foroId,
    idUsuario:         session.user.id,
  });

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath(`/dashboard/comunidad/foros/${validation.data.foroId}`);
  return { success: true, message: "Comentario publicado exitosamente" };
}

// ─── reaccionarAction ─────────────────────────────────────────────────────────
export async function reaccionarAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, message: "No autorizado" };

  const rawData = {
    tipo:         formData.get("tipo"),
    idComentario: formData.get("idComentario") || undefined,
    idArticulo:   formData.get("idArticulo")   || undefined,
  };

  const validation = ReaccionSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, message: "Datos de reacción inválidos" };
  }

  const result = await service.reaccionar({
    tipo:         validation.data.tipo,
    idUsuario:    session.user.id,
    idComentario: validation.data.idComentario,
    idArticulo:   validation.data.idArticulo,
  });

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/dashboard/comunidad");
  return {
    success: true,
    message: result.data ? "Reacción agregada" : "Reacción eliminada",
  };
}

// ─── suscribirseAction ────────────────────────────────────────────────────────
export async function suscribirseAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, message: "No autorizado" };

  const validation = SuscripcionSchema.safeParse({
    foroId: formData.get("foroId"),
  });

  if (!validation.success) {
    return { success: false, message: "Foro inválido" };
  }

  const result = await service.suscribirse(
    session.user.id,
    validation.data.foroId
  );

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/dashboard/comunidad");
  return { success: true, message: "Suscrito al foro exitosamente" };
}

// ─── desuscribirseAction ──────────────────────────────────────────────────────
export async function desuscribirseAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, message: "No autorizado" };

  const validation = SuscripcionSchema.safeParse({
    foroId: formData.get("foroId"),
  });

  if (!validation.success) {
    return { success: false, message: "Foro inválido" };
  }

  const result = await service.desuscribirse(
    session.user.id,
    validation.data.foroId
  );

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/dashboard/comunidad");
  return { success: true, message: "Desuscrito del foro exitosamente" };
}
