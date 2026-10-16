/**
 * @file src/actions/comunidad.actions.ts
 * @description Server Actions para el módulo de Comunidad y Bienestar.
 * @layer Presentation (Capa 1 — Server-side)
 */

"use server";

import { revalidatePath } from "next/cache";
import { z }              from "zod";
import { requireUser }    from "@/lib/auth/require-user";
import { ComunidadService } from "@/services/comunidad.service";
import type { ActionState } from "@/actions/habito.actions";

const service = new ComunidadService();

// ─── Schemas ──────────────────────────────────────────────────────────────────
const CreateForoSchema = z.object({
  titulo:      z.string().min(5,  "El título debe tener al menos 5 caracteres")
                         .max(120, "El título no puede superar 120 caracteres"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres")
                         .max(2000, "Máximo 2000 caracteres"),
  categoria:   z.string().min(2,  "Debes seleccionar una categoría"),
  imagenUrl:   z.string().url().optional().or(z.literal("")),
});

const ComentarSchema = z.object({
  idForo:            z.string().min(1, "Foro inválido"),
  contenido:         z.string()
                      .min(1,   "El comentario no puede estar vacío")
                      .max(1000, "Máximo 1000 caracteres"),
  idComentarioPadre: z.string().optional(),
});

// ─── createForoAction ─────────────────────────────────────────────────────────
export async function createForoAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  const rawData = {
    titulo:      formData.get("titulo"),
    descripcion: formData.get("descripcion"),
    categoria:   formData.get("categoria"),
    imagenUrl:   formData.get("imagenUrl") || "",
  };

  const validation = CreateForoSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrige los errores del formulario",
      errors:  validation.error.flatten().fieldErrors,
    };
  }

  const result = await service.createForo({
    titulo: validation.data.titulo,
    descripcion: validation.data.descripcion,
    categoria: validation.data.categoria,
    imagenUrl: validation.data.imagenUrl || undefined,
  });

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/comunidad");
  return { success: true, message: "Foro publicado exitosamente en la comunidad ✨" };
}

// ─── comentarAction ───────────────────────────────────────────────────────────
export async function comentarAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  const rawData = {
    idForo:            formData.get("idForo") || formData.get("foroId"),
    contenido:         formData.get("contenido"),
    idComentarioPadre: formData.get("idComentarioPadre") || undefined,
  };

  const validation = ComentarSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Por favor escribe un comentario válido",
      errors:  validation.error.flatten().fieldErrors,
    };
  }

  const result = await service.comentar({
    idForo:            validation.data.idForo,
    contenido:         validation.data.contenido,
    idComentarioPadre: validation.data.idComentarioPadre ?? null,
  });

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath(`/comunidad/foros/${validation.data.idForo}`);
  revalidatePath("/comunidad");
  return { success: true, message: "Comentario publicado exitosamente" };
}

// ─── reaccionarAction ─────────────────────────────────────────────────────────
export async function reaccionarAction(
  targetType: 'comentario' | 'articulo' | 'foro',
  targetId: string,
  tipo: string = 'like'
): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  const result = await service.reaccionar({
    targetType,
    targetId,
    tipo,
  });

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/comunidad");
  return { success: true, message: "Reacción registrada" };
}

// ─── clonarHabitoAction ───────────────────────────────────────────────────────
export async function clonarHabitoAction(idHabito: string): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  const result = await service.clonarHabito(idHabito);
  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/habitos");
  revalidatePath("/comunidad");
  return { success: true, message: "¡Hábito añadido a tu rutina diaria con éxito! 🎯" };
}

// ─── unirseRetoAction ─────────────────────────────────────────────────────────
export async function unirseRetoAction(retoId: string): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  const result = await service.joinReto(retoId);
  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/retos");
  revalidatePath("/comunidad");
  return { success: true, message: "¡Te has unido al reto comunitario exitosamente! 🏆" };
}

// ─── compartirHabitoAction ───────────────────────────────────────────────────
export async function compartirHabitoAction(idHabito: string): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  const result = await service.compartirHabito(idHabito);
  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/comunidad");
  return { success: true, message: "Hábito compartido en la comunidad exitosamente ✨" };
}

export async function deleteForoAction(foroId: string) {
  const { adminService } = await import("@/services/admin.service");
  return await adminService.deleteForum(foroId);
}

export async function deleteComentarioAction(comentarioId: string) {
  const { adminService } = await import("@/services/admin.service");
  return await adminService.deleteForumComment(comentarioId);
}

export async function suscribirseAction(_prevState: any, formData: FormData) {
  const foroId = formData.get("foroId") as string;
  if (!foroId) return { success: false, message: "ID del foro requerido" };
  revalidatePath("/comunidad");
  return { success: true, message: "Te has suscrito al foro" };
}

export async function desuscribirseAction(_prevState: any, formData: FormData) {
  const foroId = formData.get("foroId") as string;
  if (!foroId) return { success: false, message: "ID del foro requerido" };
  revalidatePath("/comunidad");
  return { success: true, message: "Te has desuscrito del foro" };
}
