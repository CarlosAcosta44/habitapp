/**
 * @file src/actions/usuario.actions.ts
 * @description Server Actions de proxy para el módulo de Usuario.
 * Actúa como puente entre los formularios del frontend y el backend NestJS,
 * sin duplicar la lógica de negocio que ya vive en el backend.
 *
 * @layer Presentation (Capa 1 — Server-side)
 *
 * Flujo de cada action:
 * 1. Extraer y validar datos del FormData con Zod
 * 2. Llamar al UsuarioService (que usa el apiClient con JWT automático)
 * 3. Revalidar la caché de las rutas afectadas
 * 4. Retornar resultado tipado para useActionState
 *
 * @directive "use server" — OBLIGATORIO en Server Actions
 */

"use server";

import { revalidatePath } from "next/cache";
import { z }              from "zod";
import { UsuarioService } from "@/services/usuario.service";

// ─── Tipo de retorno estándar ─────────────────────────────────────────────────
export type UsuarioActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

// ─── Schema de validación ─────────────────────────────────────────────────────
const UpdatePerfilSchema = z.object({
  nombre:     z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(45),
  apellido:   z.string().trim().min(2, "El apellido debe tener al menos 2 caracteres").max(45),
  fotoperfil: z.string().url("Debe ser una URL válida").max(200).optional().or(z.literal("")),
});

const service = new UsuarioService();

// ─── updatePerfilAction ───────────────────────────────────────────────────────
/**
 * Actualiza el perfil del usuario autenticado llamando a PATCH /users/me
 * en el backend NestJS. El JWT de Supabase se inyecta automáticamente
 * desde el apiClient usando la sesión de servidor.
 */
export async function updatePerfilAction(
  _prevState: UsuarioActionState | null,
  formData:   FormData
): Promise<UsuarioActionState> {
  // 1. Extraer y validar datos
  const raw = {
    nombre:     formData.get("nombre"),
    apellido:   formData.get("apellido"),
    fotoperfil: formData.get("fotoperfil") || undefined,
  };

  const validation = UpdatePerfilSchema.safeParse(raw);
  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrige los errores del formulario",
      errors:  validation.error.flatten().fieldErrors,
    };
  }

  // 2. Llamar al backend NestJS via UsuarioService
  const dto: { nombre: string; apellido: string; fotoperfil?: string } = {
    nombre:   validation.data.nombre,
    apellido: validation.data.apellido,
  };

  if (validation.data.fotoperfil && validation.data.fotoperfil.length > 0) {
    dto.fotoperfil = validation.data.fotoperfil;
  }

  const result = await service.updatePerfilMe(dto);

  if (!result.success) {
    // Manejar errores específicos del backend (401, 403, 422, 500)
    if (result.error.includes("401") || result.error.toLowerCase().includes("no autorizado")) {
      return { success: false, message: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente." };
    }
    if (result.error.includes("422") || result.error.toLowerCase().includes("validación")) {
      return { success: false, message: "Los datos ingresados no son válidos. Revisa el formulario." };
    }
    return { success: false, message: result.error };
  }

  // 3. Revalidar caché de rutas que muestran datos del perfil
  revalidatePath("/perfil");
  revalidatePath("/habitos");
  revalidatePath("/", "layout");

  return { success: true, message: "¡Perfil actualizado correctamente! ✅" };
}
