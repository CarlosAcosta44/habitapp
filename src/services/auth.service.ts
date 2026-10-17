/**
 * @file src/services/auth.service.ts
 * @description Service Layer para autenticación — abstrae las peticiones hacia el backend NestJS (Custom Auth).
 * @layer Business Logic (Capa 3)
 */

import { authRepository } from "@/repositories/auth.repository";
import type { Result } from "@/lib/result";

export class AuthService {
  // ─── Login ──────────────────────────────────────────────────────────────────
  async login(credentials: { email: string; password: string }): Promise<Result<{ access_token: string, user: any }>> {
    return authRepository.post<{ access_token: string, user: any }>('/auth/login', credentials);
  }

  // ─── Registro ───────────────────────────────────────────────────────────────
  async register(payload: {
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    fechanacimiento?: string;
    genero: string;
  }): Promise<Result<{ access_token: string, user: any }>> {
    return authRepository.post<{ access_token: string, user: any }>('/auth/register', payload);
  }

  // ─── Logout ─────────────────────────────────────────────────────────────────
  async logout(): Promise<Result<void>> {
    return authRepository.post<void>('/auth/logout');
  }

  // ─── Restablecer Contraseña ─────────────────────────────────────────────────
  async resetPassword(email: string): Promise<Result<void>> {
    return authRepository.post<void>('/auth/reset-password', { email });
  }

  // ─── Actualizar Contraseña ──────────────────────────────────────────────────
  async updatePassword(token: string, newPassword: string): Promise<Result<void>> {
    return authRepository.put<void>('/auth/update-password', { token, newPassword });
  }
}
