/**
 * @file src/actions/seguridad.actions.ts
 * @description Server Actions para el módulo de Seguridad y Ajustes de cuenta.
 * @layer Presentation (Capa 1 — Server-side)
 *
 * - updateNameAction  → Proxy hacia PATCH /users/me del backend NestJS
 * - updateEmailAction → Llama directamente a Supabase Auth (cambio de email
 *                       requiere confirmación por correo, no pasa por NestJS)
 * - updatePasswordAction → Llama directamente a Supabase Auth
 *
 * @directive "use server" — OBLIGATORIO en Server Actions
 */

"use server";

import { z }              from "zod";
import { revalidatePath } from "next/cache";
import { headers }        from "next/headers";
import { createClient }   from "@/lib/supabase/server";
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
 * Actualiza el correo electrónico del usuario directamente vía Supabase Auth.
 * El cambio de email requiere confirmación por correo y no pasa por NestJS.
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

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente." };
  }

  // Construir la URL de confirmación de forma dinámica
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const { error } = await supabase.auth.updateUser(
    { email: parsed.data.email },
    { emailRedirectTo: `${origin}/auth/callback?next=/ajustes/seguridad` }
  );

  if (error) {
    if (error.message.toLowerCase().includes("rate limit")) {
      return { error: "Se alcanzó el límite de solicitudes. Intenta nuevamente en unos minutos." };
    }
    return { error: "No fue posible actualizar el correo. Intenta nuevamente." };
  }

  return {
    success: "Se ha enviado un enlace de confirmación a tu nuevo correo. Revisa tu bandeja de entrada.",
  };
}

// ─── updatePasswordAction ─────────────────────────────────────────────────────
/**
 * Actualiza la contraseña del usuario directamente vía Supabase Auth.
 * No pasa por NestJS — la gestión de credenciales es responsabilidad de Supabase.
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

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (error) {
    if (error.message.toLowerCase().includes("password")) {
      return { error: "La nueva contraseña no cumple los requisitos mínimos de seguridad." };
    }
    return { error: "No fue posible actualizar la contraseña. Intenta nuevamente." };
  }

  revalidatePath("/ajustes/seguridad");
  return { success: "¡Tu contraseña ha sido actualizada exitosamente!" };
}
