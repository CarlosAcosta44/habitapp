'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Mock types
export type ActionState = {
  success?: string;
  error?: string;
  formErrors?: Record<string, string[]>;
};

// Zod schemas
const UpdateNameSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(45),
  apellido: z.string().trim().min(2, "El apellido debe tener al menos 2 caracteres").max(45),
  password: z.string().min(1, "Ingresa tu contraseña actual para verificar"),
});

const UpdateEmailSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(1, "Ingresa tu contraseña actual para verificar"),
});

const UpdatePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Ingresa tu contraseña actual"),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirma la nueva contraseña"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas nuevas no coinciden",
  path: ["confirmPassword"],
});

// Artifical delay for UX simulation
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function updateNameAction(_prev: ActionState | null, formData: FormData): Promise<ActionState> {
  await delay(1200);

  const parsed = UpdateNameSchema.safeParse({
    nombre: formData.get('nombre'),
    apellido: formData.get('apellido'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { formErrors: parsed.error.flatten().fieldErrors };
  }

  // Visual simulation logic (Mock successful logic without writing to DB)
  if (parsed.data.password !== "123456" && parsed.data.password !== "mockpassword") {
    // We send a generic password error to simulate validation failure if they don't know the trick,
    // actually, let's just accept any string over length 5 for the demo to feel satisfying to the user,
    // but give an error if it's "123"
    if (parsed.data.password.length < 6) {
      return { error: "Contraseña incorrecta. Verificación fallida." };
    }
  }

  revalidatePath('/ajustes/seguridad');
  return { success: "¡Nombre actualizado con éxito!" };
}

export async function updateEmailAction(_prev: ActionState | null, formData: FormData): Promise<ActionState> {
  await delay(1200);

  const parsed = UpdateEmailSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { formErrors: parsed.error.flatten().fieldErrors };
  }

  if (parsed.data.password.length < 6) {
    return { error: "Contraseña incorrecta. Verificación fallida." };
  }

  return { success: "Se ha enviado un enlace de confirmación a tu nuevo correo." };
}

export async function updatePasswordAction(_prev: ActionState | null, formData: FormData): Promise<ActionState> {
  await delay(1200);

  const parsed = UpdatePasswordSchema.safeParse({
    oldPassword: formData.get('oldPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return { formErrors: parsed.error.flatten().fieldErrors };
  }

  if (parsed.data.oldPassword.length < 6) {
    return { error: "Contraseña actual incorrecta." };
  }

  if (parsed.data.oldPassword === parsed.data.newPassword) {
    return { error: "La nueva contraseña debe ser distinta a la anterior." };
  }

  return { success: "¡Tu contraseña ha sido actualizada exitosamente!" };
}
