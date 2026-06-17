/**
 * @file src/services/usuario.service.ts
 * @description Service Layer para la gestión del perfil de usuario a través del backend NestJS.
 * @layer Business Logic (Capa 3)
 */

import { apiClient } from "@/lib/api/client";
import type { Result } from "@/lib/result";
import type { UserProfileDto, UpdateUserProfileDto } from "@/types/domain/usuario.types";

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
