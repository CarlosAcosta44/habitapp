/**
 * @file src/actions/habito.actions.ts
 * @description Server Actions para el módulo de Hábitos.
 * @layer Presentation (Capa 1 — Server-side)
 *
 * Flujo de cada action:
 * 1. Obtener sesión del usuario autenticado
 * 2. Extraer y validar datos del FormData con Zod
 * 3. Llamar al servicio con los datos validados
 * 4. Revalidar cache y retornar resultado
 *
 * @directive "use server" — OBLIGATORIO en Server Actions
 */

"use server";

import { revalidatePath } from "next/cache";
import { z }              from "zod";
import { requireUser }    from "@/lib/auth/require-user";
import { HabitoService }  from "@/services/habito.service";
import type { CategoriaHabito } from "@/domain/habito.types";

const service = new HabitoService();

// ─── Schemas de validación Zod ────────────────────────────────────────────────
const CreateHabitoSchema = z.object({
  nombre:      z.string().min(3,  "El nombre debe tener al menos 3 caracteres")
                         .max(45, "El nombre no puede superar 45 caracteres"),
  descripcion: z.string().max(200).optional(),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  fechaFin:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida").optional(),
  puntos:      z.coerce.number().min(1, "Mínimo 1 punto").max(100, "Máximo 100 puntos"),
  idCategoria: z.string().min(1, "Debes seleccionar una categoría"),
  metaDiaria:  z.coerce.number().min(1, "Mínimo 1").default(1),
  unidadMedida:z.string().default("veces"),
  diasSemana:  z.array(z.number()).default([1, 2, 3, 4, 5, 6, 7]),
  recordatorios: z.array(z.string()).optional(),
});

const UpdateHabitoSchema = CreateHabitoSchema.partial().extend({
  estado: z.enum(["Activo", "Inactivo", "Completado", "Archivado", "Pausado", "Cancelado"]).optional(),
});

// ─── Tipo de retorno estándar para useActionState ─────────────────────────────
export type ActionState = {
  success:  boolean;
  message:  string;
  errors?:  Record<string, string[]>;
};

// ─── createHabitoAction ───────────────────────────────────────────────────────
export async function createHabitoAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };
  const user = userResult.data;

  const diasSemanaRaw = formData.get("diasSemana");
  let diasSemanaParsed = [1, 2, 3, 4, 5, 6, 7];
  if (typeof diasSemanaRaw === "string" && diasSemanaRaw.trim()) {
    try {
      const p = JSON.parse(diasSemanaRaw);
      if (Array.isArray(p) && p.length > 0) diasSemanaParsed = p.map(Number);
    } catch {
      // fallback
    }
  }

  const recordatoriosRaw = formData.get("recordatorios");
  let recordatoriosParsed: string[] | undefined;
  if (typeof recordatoriosRaw === "string" && recordatoriosRaw.trim()) {
    try {
      const p = JSON.parse(recordatoriosRaw);
      if (Array.isArray(p)) recordatoriosParsed = p.map(String).filter(Boolean);
    } catch {
      // fallback
    }
  }

  const rawData = {
    nombre:      formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    fechaInicio: formData.get("fechaInicio"),
    fechaFin:    formData.get("fechaFin") || undefined,
    puntos:      formData.get("puntos"),
    idCategoria: formData.get("idCategoria"),
    metaDiaria:  formData.get("metaDiaria") || 1,
    unidadMedida:formData.get("unidadMedida") || "veces",
    diasSemana:  diasSemanaParsed,
    recordatorios: recordatoriosParsed,
  };

  const validation = CreateHabitoSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrige los errores del formulario",
      errors:  validation.error.flatten().fieldErrors,
    };
  }

  let idCategoriaFinal = validation.data.idCategoria;
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(idCategoriaFinal)) {
    const nombreFallback = idCategoriaFinal
      .replace("cat-", "")
      .replace("-", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const categoriasResult = await service.getCategorias();
    if (categoriasResult.success) {
      const match = categoriasResult.data.find(
        (c) => c.nombre.toLowerCase() === nombreFallback.toLowerCase()
      );
      if (match) {
        idCategoriaFinal = match.idCategoria;
      } else {
        return { success: false, message: `No se encontró la categoría "${nombreFallback}" en la base de datos.` };
      }
    } else {
      return { success: false, message: "No se pudo conectar con la base de datos para validar la categoría." };
    }
  }

  const result = await service.create({
    ...validation.data,
    idCategoria: idCategoriaFinal,
    descripcion: validation.data.descripcion ?? undefined,
    fechaFin:    validation.data.fechaFin    ?? undefined,
    metaDiaria:  validation.data.metaDiaria,
    unidadMedida:validation.data.unidadMedida,
    diasSemana:  validation.data.diasSemana,
    recordatorios: validation.data.recordatorios,
  });

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/habitos");
  return { success: true, message: "Hábito creado exitosamente" };
}

// ─── updateHabitoAction ───────────────────────────────────────────────────────
export async function updateHabitoAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };
  const user = userResult.data;

  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID del hábito requerido" };

  const diasSemanaRaw = formData.get("diasSemana");
  let diasSemanaParsed: number[] | undefined;
  if (typeof diasSemanaRaw === "string" && diasSemanaRaw.trim()) {
    try {
      const p = JSON.parse(diasSemanaRaw);
      if (Array.isArray(p) && p.length > 0) diasSemanaParsed = p.map(Number);
    } catch {
      // fallback
    }
  }

  const recordatoriosRaw = formData.get("recordatorios");
  let recordatoriosParsed: string[] | undefined;
  if (typeof recordatoriosRaw === "string" && recordatoriosRaw.trim()) {
    try {
      const p = JSON.parse(recordatoriosRaw);
      if (Array.isArray(p)) recordatoriosParsed = p.map(String).filter(Boolean);
    } catch {
      // fallback
    }
  }

  const rawData = {
    nombre:      formData.get("nombre") || undefined,
    descripcion: formData.get("descripcion") || undefined,
    fechaFin:    formData.get("fechaFin") || undefined,
    puntos:      formData.get("puntos") || undefined,
    idCategoria: formData.get("idCategoria") || undefined,
    estado:      formData.get("estado") || undefined,
    metaDiaria:  formData.get("metaDiaria") || undefined,
    unidadMedida:formData.get("unidadMedida") || undefined,
    diasSemana:  diasSemanaParsed,
    recordatorios: recordatoriosParsed,
  };

  const validation = UpdateHabitoSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrige los errores del formulario",
      errors:  validation.error.flatten().fieldErrors,
    };
  }

  const result = await service.update(id, {
    ...validation.data,
    fechaFin: validation.data.fechaFin ?? undefined,
    metaDiaria: validation.data.metaDiaria ?? undefined,
    unidadMedida: validation.data.unidadMedida ?? undefined,
    diasSemana: validation.data.diasSemana,
    recordatorios: validation.data.recordatorios,
  });

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/habitos");
  return { success: true, message: "Hábito actualizado exitosamente" };
}

// ─── deleteHabitoAction ───────────────────────────────────────────────────────
export async function deleteHabitoAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID del hábito requerido" };

  const result = await service.delete(id);
  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/habitos");
  return { success: true, message: "Hábito eliminado permanentemente 🗑️" };
}

// ─── completarHabitoAction ────────────────────────────────────────────────────
export async function completarHabitoAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };
  const user = userResult.data;

  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID del hábito requerido" };

  const result = await service.completar(id);
  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/habitos");
  return { success: true, message: "¡Hábito completado! 🎉" };
}

// ─── getCategoriasAction ──────────────────────────────────────────────────────
export async function getCategoriasAction(): Promise<CategoriaHabito[]> {
  const result = await service.getCategorias();
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  }
  return [];
}

// ─── getArchivadosAction ──────────────────────────────────────────────────────
export async function getArchivadosAction(): Promise<any[]> {
  const result = await service.getAll("Inactivo");
  if (result.success && Array.isArray(result.data) && result.data.length > 0) {
    return result.data;
  }
  const resultArchivados = await service.getAll("Archivado");
  if (resultArchivados.success && Array.isArray(resultArchivados.data)) {
    return resultArchivados.data;
  }
  return [];
}

// ─── reactivarHabitoAction ────────────────────────────────────────────────────
export async function reactivarHabitoAction(idHabito: string): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  const result = await service.update(idHabito, { estado: "Activo" });
  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/habitos");
  return { success: true, message: "Hábito reactivado exitosamente ✨" };
}

// ─── archivarHabitoAction ─────────────────────────────────────────────────────
export async function archivarHabitoAction(idHabito: string): Promise<ActionState> {
  const userResult = await requireUser();
  if (!userResult.success) return { success: false, message: userResult.error };

  // En la BD el estado de hábitos pausados/archivados es 'Inactivo'
  const result = await service.update(idHabito, { estado: "Inactivo" });
  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/habitos");
  return { success: true, message: "Hábito archivado exitosamente 📦" };
}
