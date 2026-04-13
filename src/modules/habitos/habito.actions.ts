/**
 * @file src/modules/habitos/habito.actions.ts
 * @description Server Actions para el módulo de Hábitos.
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
import { redirect }       from "next/navigation";
import { z }              from "zod";
import { createClient }   from "@/lib/supabase/server";
import { HabitoService }  from "./habito.service";

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
});

const UpdateHabitoSchema = CreateHabitoSchema.partial().extend({
  estado: z.enum(["Activo", "Inactivo", "Completado"]).optional(),
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
  // 1. Verificar sesión
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, message: "No autorizado" };

  // 2. Extraer y validar datos
  const rawData = {
    nombre:      formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    fechaInicio: formData.get("fechaInicio"),
    fechaFin:    formData.get("fechaFin") || undefined,
    puntos:      formData.get("puntos"),
    idCategoria: formData.get("idCategoria"),
    metaDiaria:  formData.get("metaDiaria") || 1,
    unidadMedida:formData.get("unidadMedida") || "veces",
  };

  const validation = CreateHabitoSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrige los errores del formulario",
      errors:  validation.error.flatten().fieldErrors,
    };
  }

  // Si el idCategoria es un ID de fallback (no UUID), buscamos la categoría real por nombre
  let idCategoriaFinal = validation.data.idCategoria;
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(idCategoriaFinal)) {
    // Extraer el nombre del fallback ID (ej: 'cat-ejercicio' -> 'Ejercicio')
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
        return { success: false, message: `No se encontró la categoría "${nombreFallback}" en la base de datos. Por favor ejecuta el script SQL de datos iniciales en Supabase.` };
      }
    } else {
      return { success: false, message: "No se pudo conectar con la base de datos para validar la categoría." };
    }
  }

  // 3. Llamar al servicio
  const result = await service.create({
    ...validation.data,
    idCategoria: idCategoriaFinal,
    descripcion: validation.data.descripcion ?? null,
    fechaFin:    validation.data.fechaFin    ?? null,
    estado:      "Activo",
    idUsuario:   session.user.id,
    metaDiaria:  validation.data.metaDiaria,
    unidadMedida:validation.data.unidadMedida,
  });

  if (!result.success) {
    return { success: false, message: result.error };
  }

  // 4. Revalidar y retornar
  revalidatePath("/habitos");
  redirect("/habitos");
  return { success: true, message: "Hábito creado exitosamente" };
}

// ─── updateHabitoAction ───────────────────────────────────────────────────────
export async function updateHabitoAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, message: "No autorizado" };

  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID del hábito requerido" };

  const rawData = {
    nombre:      formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    fechaFin:    formData.get("fechaFin") || undefined,
    puntos:      formData.get("puntos"),
    idCategoria: formData.get("idCategoria"),
    estado:      formData.get("estado"),
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
    fechaFin: validation.data.fechaFin ?? null,
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
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, message: "No autorizado" };

  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID del hábito requerido" };

  const result = await service.delete(id);
  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/habitos");
  return { success: true, message: "Hábito eliminado exitosamente" };
}

// ─── completarHabitoAction ────────────────────────────────────────────────────
export async function completarHabitoAction(
  _prevState: ActionState | null,
  formData:   FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, message: "No autorizado" };

  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID del hábito requerido" };

  const result = await service.completar(id);
  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/habitos");
  return { success: true, message: "¡Hábito completado! 🎉" };
}