/**
 * @file src/services/usuario.service.ts
 * @description Service Layer para la gestión del perfil de usuario a través del backend NestJS.
 * @layer Business Logic (Capa 3)
 */

import { apiClient, setTokenGetter } from "@/lib/api/client";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/result";
import type { UserProfileDto, UpdateUserProfileDto } from "@/types/domain/usuario.types";

// Registrar el getter del token para uso exclusivo en el servidor
setTokenGetter(async () => {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  } catch (error) {
    console.error("Error al obtener token en UsuarioService:", error);
    return null;
  }
});

export class UsuarioService {
  /**
   * Obtiene el perfil completo del usuario autenticado actual.
   * Llama a: GET /users/me
   */
  async getPerfilMe(): Promise<Result<UserProfileDto>> {
    return apiClient.get<UserProfileDto>("users/me");
  }

  /**
   * Actualiza los datos del perfil del usuario autenticado actual.
   * Llama a: PATCH /users/me
   */
  async updatePerfilMe(dto: UpdateUserProfileDto): Promise<Result<UserProfileDto>> {
    return apiClient.patch<UserProfileDto>("users/me", dto);
  }
}
