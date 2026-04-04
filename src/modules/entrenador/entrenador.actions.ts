/**
 * @file src/modules/entrenador/entrenador.actions.ts
 * @description Server Actions para el módulo de Entrenadores.
 */

"use server";

import { revalidatePath } from "next/cache";
import { z }              from "zod";
import { createClient }   from "@/lib/supabase/server";
import { EntrenadorService } from "./entrenador.service";
import type { ActionState }  from "@/modules/habitos/habito.actions";

const service = new EntrenadorService();

// ─── Schemas ──────────────────────────────────────────────────────────────────
const CreateRutinaSchema = z.object({
  tipo:        z.string().min(3,  "El tipo debe tener al menos 3 caracteres")
                         .max(30, "El tipo no puede superar 30 caracteres"),
  descripcion: z.string().max(500).optional(),
  duracion:    z.coerce.number().positive("La duración debe ser positiva").optional(),
  objetivo:    z.string().max(200).optional(),
  nivel:       z.enum(["Principiante", "Intermedio", "Avanzado"]),
});

const CreateSeguimientoSchema = z.object({
  idUsuario:     z.string().uuid("Usuario inválido"),
  progreso:      z.string().max(100).optional(),
  observaciones: z.string().max(200).optional(),
});

const AsignarRutinaSchema = z.object({
  idUsuario:   z.string().uuid("Usuario inválido"),
  idRutina:    z.string().uuid("Rutina inválida"),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
});

// ─── createRutinaAction ───────────────────────────────────────────────────────
export async function createRutinaAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, message: "No autorizado" };

  const rawData = {
    tipo:        formData.get("tipo"),
    descripcion: formData.get("descripcion") || undefined,
    duracion:    formData.get("duracion")    || undefined,
    objetivo:    formData.get("objetivo")    || undefined,
    nivel:       formData.get("nivel"),
  };

  const validation = CreateRutinaSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrige los errores del formulario",
      errors:  validation.error.flatten().fieldErrors,
    };
  }

  // Obtener el perfil del entrenador
  const perfilResult = await service.getPerfilByUsuario(session.user.id);
  if (!perfilResult.success) {
    return { success: false, message: perfilResult.error };
  }

  const result = await service.createRutina({
    ...validation.data,
    descripcion:  validation.data.descripcion  ?? null,
    duracion:     validation.data.duracion      ?? null,
    objetivo:     validation.data.objetivo      ?? null,
    idEntrenador: perfilResult.data.idEntrenador,
  });

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/dashboard/entrenador/rutinas");
  return { success: true, message: "Rutina creada exitosamente" };
}

// ─── asignarRutinaAction ──────────────────────────────────────────────────────
export async function asignarRutinaAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, message: "No autorizado" };

  const rawData = {
    idUsuario:   formData.get("idUsuario"),
    idRutina:    formData.get("idRutina"),
    fechaInicio: formData.get("fechaInicio"),
  };

  const validation = AsignarRutinaSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Datos inválidos",
      errors:  validation.error.flatten().fieldErrors,
    };
  }

  const perfilResult = await service.getPerfilByUsuario(session.user.id);
  if (!perfilResult.success) {
    return { success: false, message: perfilResult.error };
  }

  const result = await service.asignarRutina(
    validation.data,
    perfilResult.data.idEntrenador
  );

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/dashboard/entrenador");
  return { success: true, message: "Rutina asignada exitosamente" };
}

// ─── registrarSeguimientoAction ───────────────────────────────────────────────
export async function registrarSeguimientoAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, message: "No autorizado" };

  const rawData = {
    idUsuario:     formData.get("idUsuario"),
    progreso:      formData.get("progreso")      || undefined,
    observaciones: formData.get("observaciones") || undefined,
  };

  const validation = CreateSeguimientoSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Datos inválidos",
      errors:  validation.error.flatten().fieldErrors,
    };
  }

  const perfilResult = await service.getPerfilByUsuario(session.user.id);
  if (!perfilResult.success) {
    return { success: false, message: perfilResult.error };
  }

  const result = await service.registrarSeguimiento({
    idUsuario:     validation.data.idUsuario,
    idEntrenador:  perfilResult.data.idEntrenador,
    progreso:      validation.data.progreso      ?? null,
    observaciones: validation.data.observaciones ?? null,
    fecha:         new Date().toISOString().split("T")[0],
  });

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/dashboard/entrenador");
  return { success: true, message: "Seguimiento registrado exitosamente" };
}