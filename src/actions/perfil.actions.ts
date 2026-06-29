"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { UsuarioService } from "@/services/usuario.service";
import { requireUser } from "@/lib/supabase/server";

export type PerfilActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: any;
};

const UpdatePerfilSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(45),
  apellido: z.string().trim().min(2, "El apellido debe tener al menos 2 caracteres").max(45),
});

const perfilService = new UsuarioService();

export async function updatePerfilBasicoAction(
  _prevState: PerfilActionState | null,
  formData: FormData
): Promise<PerfilActionState> {
  const raw = {
    nombre: formData.get("nombre"),
    apellido: formData.get("apellido"),
  };

  const validation = UpdatePerfilSchema.safeParse(raw);
  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrige los errores del formulario.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await perfilService.updateProfile({
    nombre: validation.data.nombre,
    apellido: validation.data.apellido,
  });

  if (!result.success) {
    return { success: false, message: result.error };
  }

  revalidatePath("/perfil");
  revalidatePath("/ajustes");
  revalidatePath("/", "layout");

  return { success: true, message: "¡Perfil actualizado correctamente! ✅" };
}

export async function updateAvatarAction(
  formData: FormData
): Promise<PerfilActionState> {
  try {
    const user = await requireUser();
    const file = formData.get("avatar") as File | null;
    
    if (!file || file.size === 0) {
      return { success: false, message: "No se seleccionó ninguna imagen." };
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      return { success: false, message: "La imagen es demasiado grande. Máximo 5MB." };
    }
    
    if (!file.type.startsWith('image/')) {
      return { success: false, message: "El archivo debe ser una imagen." };
    }

    const result = await perfilService.updateAvatar(user.id, file);

    if (!result.success) {
      return { success: false, message: result.error };
    }

    revalidatePath("/perfil");
    revalidatePath("/ajustes");
    revalidatePath("/", "layout");

    return { success: true, message: "¡Avatar actualizado correctamente! ✅", data: result.data };
  } catch (error) {
    return { success: false, message: "Error inesperado al subir la imagen." };
  }
}
