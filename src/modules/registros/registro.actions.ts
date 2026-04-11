/**
 * @file src/modules/registros/registro.actions.ts
 * @description Server Actions para registros diarios de hábitos.
 */

"use server";

import { revalidatePath } from "next/cache";
import { z }              from "zod";
import { createClient }   from "@/lib/supabase/server";
import { RegistroService } from "./registro.service";
import type { ActionState } from "@/modules/habitos/habito.actions";

const service = new RegistroService();

// ─── Schemas ──────────────────────────────────────────────────────────────────
const MarcarCompletadoSchema = z.object({
  idHabito:   z.string().uuid("Hábito inválido"),
  fecha:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  observacion: z.string().max(200).optional(),
});

const AvanzarProgresoSchema = z.object({
  idHabito:   z.string().uuid("Hábito inválido"),
  fecha:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  cantidadAsumar: z.coerce.number().min(1),
  metaDiaria: z.coerce.number().min(1),
  observacion: z.string().max(200).optional(),
});

// ─── marcarCompletadoAction ───────────────────────────────────────────────────
export async function marcarCompletadoAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, message: "No autorizado" };

  const rawData = {
    idHabito:    formData.get("idHabito"),
    fecha:       formData.get("fecha"),
    observacion: formData.get("observacion") || undefined,
  };

  const validation = MarcarCompletadoSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Datos inválidos",
      errors:  validation.error.flatten().fieldErrors,
    };
  }

  const result = await service.marcarCompletado({
    idHabito:    validation.data.idHabito,
    idUsuario:   session.user.id,
    fecha:       validation.data.fecha,
    observacion: validation.data.observacion,
  });

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/habitos");
  return { success: true, message: "¡Hábito completado! +puntos 🎯" };
}

// ─── desmarcarCompletadoAction ────────────────────────────────────────────────
export async function desmarcarCompletadoAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, message: "No autorizado" };

  const idHabito = formData.get("idHabito") as string;
  if (!idHabito) return { success: false, message: "ID del hábito requerido" };

  const result = await service.desmarcarCompletado(idHabito, session.user.id);
  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/habitos");
  return { success: true, message: "Registro desmarcado" };
}

// ─── avanzarProgresoAction ────────────────────────────────────────────────────
export async function avanzarProgresoAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, message: "No autorizado" };

  const rawData = {
    idHabito:       formData.get("idHabito"),
    fecha:          formData.get("fecha"),
    cantidadAsumar: formData.get("cantidadAsumar"),
    metaDiaria:     formData.get("metaDiaria"),
    observacion:    formData.get("observacion") || undefined,
  };

  const validation = AvanzarProgresoSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Datos inválidos",
      errors:  validation.error.flatten().fieldErrors,
    };
  }

  const result = await service.avanzarProgreso({
    idHabito:       validation.data.idHabito,
    idUsuario:      session.user.id,
    fecha:          validation.data.fecha,
    cantidadAsumar: validation.data.cantidadAsumar,
    metaDiaria:     validation.data.metaDiaria,
    observacion:    validation.data.observacion,
  });

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/habitos");
  return { success: true, message: "Progreso guardado ✨" };
}