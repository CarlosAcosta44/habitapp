/**
 * @file src/actions/comunidad.actions.ts
 * @description Server Actions para el módulo de Comunidad y Bienestar.
 * @layer Presentation (Capa 1 — Server-side)
 */

"use server";

import { revalidatePath } from "next/cache";
import { cookies }        from "next/headers";
import { z }              from "zod";
import { requireUser }    from "@/lib/auth/require-user";
import { ComunidadService } from "@/services/comunidad.service";
import type { ActionState } from "@/actions/habito.actions";

const service = new ComunidadService();

// ─── Schemas ──────────────────────────────────────────────────────────────────
const CreateForoSchema = z.object({
  titulo:      z.string().min(5,  "El título debe tener al menos 5 caracteres")
                         .max(45, "El título no puede superar 45 caracteres"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres")
                         .max(2000, "Máximo 2000 caracteres"),
  categoria:   z.string().min(2,  "Debes seleccionar una categoría")
                         .max(45, "La categoría no puede superar 45 caracteres"),
  imagenUrl:   z.string().optional().or(z.literal("")),
});

const ComentarSchema = z.object({
  idForo:            z.string().min(1, "Foro inválido"),
  contenido:         z.string()
                      .max(2000, "Máximo 2000 caracteres")
                      .optional()
                      .or(z.literal("")),
  idComentarioPadre: z.string().optional(),
  imagenUrl:         z.string().optional(),
}).refine((data) => (data.contenido && data.contenido.trim().length > 0) || !!data.imagenUrl, {
  message: "El comentario debe contener texto o una imagen adjunta",
  path: ["contenido"],
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
    contenido:         formData.get("contenido") || "",
    idComentarioPadre: formData.get("idComentarioPadre") || undefined,
    imagenUrl:         formData.get("imagenUrl") || undefined,
  };

  const validation = ComentarSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Por favor escribe un comentario o adjunta una imagen válida",
      errors:  validation.error.flatten().fieldErrors,
    };
  }

  const result = await service.comentar({
    idForo:            validation.data.idForo,
    contenido:         validation.data.contenido || "",
    idComentarioPadre: validation.data.idComentarioPadre ?? null,
    imagenUrl:         validation.data.imagenUrl ?? null,
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

  revalidatePath("/comunidad");
  revalidatePath("/dashboard");
  return { success: true, message: "¡Te has unido al reto comunitario exitosamente! 🏆" };
}

// ─── salirRetoAction ──────────────────────────────────────────────────────────
export async function salirRetoAction(retoId: string): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  const result = await service.leaveReto(retoId);
  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/comunidad");
  revalidatePath("/dashboard");
  return { success: true, message: "Has salido del reto correctamente." };
}

// ─── checkinRetoAction ────────────────────────────────────────────────────────
export async function checkinRetoAction(
  retoId: string
): Promise<ActionState & { completed?: boolean; puntosGanados?: number; progreso?: number; dias_progreso?: number }> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  const result = await service.checkinReto(retoId);
  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/comunidad");
  revalidatePath("/dashboard");
  return {
    success: true,
    message: result.data.message || "¡Avance registrado exitosamente! 🎯",
    completed: result.data.completed,
    puntosGanados: result.data.puntosGanados,
    progreso: result.data.progreso,
    dias_progreso: result.data.dias_progreso,
  };
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

export async function updateForoAction(
  foroId: string,
  updates: { titulo: string; descripcion: string; categoria?: string; imagenUrl?: string }
): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  if (!updates.titulo?.trim() || updates.titulo.trim().length < 5) {
    return { success: false, message: "El título debe tener al menos 5 caracteres" };
  }
  if (!updates.descripcion?.trim() || updates.descripcion.trim().length < 10) {
    return { success: false, message: "La descripción debe tener al menos 10 caracteres" };
  }

  const res = await service.updateForo(foroId, updates);
  if (!res.success) {
    return { success: false, message: res.error };
  }

  revalidatePath("/comunidad");
  revalidatePath(`/comunidad/foros/${foroId}`);
  return { success: true, message: "Foro actualizado exitosamente ✨" };
}

export async function deleteForoAction(foroId: string): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  const res = await service.deleteForo(foroId);
  if (!res.success) {
    return { success: false, message: res.error };
  }

  revalidatePath("/comunidad");
  return { success: true, message: "Foro eliminado exitosamente" };
}

export async function updateComentarioAction(
  comentarioId: string,
  contenido: string,
  foroId?: string
): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  if (!contenido?.trim()) {
    return { success: false, message: "El comentario no puede estar vacío" };
  }

  const res = await service.updateComentario(comentarioId, contenido.trim());
  if (!res.success) {
    return { success: false, message: res.error };
  }

  revalidatePath("/comunidad");
  if (foroId) {
    revalidatePath(`/comunidad/foros/${foroId}`);
  }
  return { success: true, message: "Comentario actualizado exitosamente ✨" };
}

export async function deleteComentarioAction(comentarioId: string, foroId?: string): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  const res = await service.deleteComentario(comentarioId);
  if (!res.success) {
    return { success: false, message: res.error };
  }

  revalidatePath("/comunidad");
  if (foroId) {
    revalidatePath(`/comunidad/foros/${foroId}`);
  }
  return { success: true, message: "Comentario eliminado exitosamente" };
}

export async function createRetoAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  const titulo = formData.get("titulo") as string;
  const descripcion = formData.get("descripcion") as string;
  const fechaInicio = formData.get("fechaInicio") as string;
  const fechaFin = formData.get("fechaFin") as string;
  const insigniaRecompensa = formData.get("insigniaRecompensa") as string;
  const icono = formData.get("icono") as string;
  const diasObjetivo = Number.parseInt(formData.get("diasObjetivo") as string, 10) || 7;

  if (!titulo?.trim() || titulo.trim().length < 5) {
    return { success: false, message: "El título debe tener al menos 5 caracteres" };
  }
  if (!descripcion?.trim() || descripcion.trim().length < 10) {
    return { success: false, message: "La descripción debe tener al menos 10 caracteres" };
  }

  const res = await service.createReto({
    titulo: titulo.trim(),
    descripcion: descripcion.trim(),
    puntosRecompensa: 50,
    fechaInicio: fechaInicio || undefined,
    fechaFin: fechaFin || undefined,
    insigniaRecompensa: insigniaRecompensa || '🏆',
    icono: icono || insigniaRecompensa || '🏆',
    diasObjetivo,
  });

  if (!res.success) {
    return { success: false, message: res.error };
  }

  revalidatePath("/comunidad");
  revalidatePath("/habitos");
  return { success: true, message: "¡Reto comunitario creado y te has unido exitosamente! 🏆" };
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

// ─── uploadComunidadImageAction ──────────────────────────────────────────────
export async function uploadComunidadImageAction(
  formData: FormData
): Promise<{ success: boolean; url?: string; message?: string }> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  const file = formData.get("file") as File;
  if (!file || !(file instanceof File) || file.size === 0) {
    return { success: false, message: "Por favor selecciona un archivo de imagen válido" };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

    const forwardFd = new FormData();
    forwardFd.append("file", file);

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${backendUrl}/users/community/upload-image`, {
      method: "POST",
      headers,
      body: forwardFd,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, message: errData.message || "Error al subir la imagen" };
    }

    const data = await res.json();
    return { success: true, url: data.url };
  } catch (err: any) {
    return { success: false, message: err?.message || "Error al conectar con el servidor" };
  }
}

