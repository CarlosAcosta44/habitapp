/**
 * @file src/actions/seguridad.actions.ts
 * @description Server Actions para el módulo de Seguridad y Ajustes de cuenta.
 * @layer Presentation (Capa 1 — Server-side)
 *
 * - updateNameAction  → Proxy hacia PATCH /users/me del backend NestJS
 * - updateEmailAction → Pendiente de migración a NestJS (Custom Auth)
 * - updatePasswordAction → Pendiente de migración a NestJS (Custom Auth)
 *
 * @directive "use server" — OBLIGATORIO en Server Actions
 */

"use server";

import { z }              from "zod";
import { revalidatePath } from "next/cache";
import { headers }        from "next/headers";

import { UsuarioService } from "@/services/usuario.service";

// ─── Tipo de retorno estándar ─────────────────────────────────────────────────
export type ActionState = {
  success?: string;
  error?: string;
  formErrors?: Record<string, string[]>;
};

// ─── Schemas de validación ────────────────────────────────────────────────────
const UpdateNameSchema = z.object({
  nombre:   z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(45),
  apellido: z.string().trim().min(2, "El apellido debe tener al menos 2 caracteres").max(45),
});

const UpdateEmailSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
});

const UpdatePasswordSchema = z.object({
  newPassword:     z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirma la nueva contraseña"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas nuevas no coinciden",
  path: ["confirmPassword"],
});

const service = new UsuarioService();

// ─── updateNameAction ─────────────────────────────────────────────────────────
/**
 * Actualiza el nombre y apellido del usuario.
 * Proxy hacia PATCH /users/me en el backend NestJS.
 */
export async function updateNameAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const parsed = UpdateNameSchema.safeParse({
    nombre:   formData.get("nombre"),
    apellido: formData.get("apellido"),
  });

  if (!parsed.success) {
    return { formErrors: parsed.error.flatten().fieldErrors };
  }

  const result = await service.updatePerfilMe({
    nombre:   parsed.data.nombre,
    apellido: parsed.data.apellido,
  });

  if (!result.success) {
    if (result.error.includes("401") || result.error.toLowerCase().includes("no autorizado")) {
      return { error: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente." };
    }
    return { error: result.error };
  }

  revalidatePath("/perfil");
  revalidatePath("/habitos");
  revalidatePath("/", "layout");

  return { success: "¡Nombre y apellido actualizados correctamente!" };
}

// ─── updateEmailAction ────────────────────────────────────────────────────────
/**
 * Actualiza el correo electrónico del usuario vía NestJS Custom Auth.
 * (Actualmente en migración)
 */
export async function updateEmailAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const parsed = UpdateEmailSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { formErrors: parsed.error.flatten().fieldErrors };
  }

  // TODO: Implementar cambio de correo en NestJS
  return { error: "El cambio de correo electrónico está en migración hacia el nuevo sistema Custom Auth." };
}

// ─── updatePasswordAction ─────────────────────────────────────────────────────
/**
 * Actualiza la contraseña del usuario autenticado vía NestJS Custom Auth.
 * (Actualmente en migración)
 */
export async function updatePasswordAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const parsed = UpdatePasswordSchema.safeParse({
    newPassword:     formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { formErrors: parsed.error.flatten().fieldErrors };
  }

  // TODO: Implementar cambio de contraseña autenticado en NestJS
  return { error: "El cambio de contraseña está en migración hacia el nuevo sistema Custom Auth." };
}
