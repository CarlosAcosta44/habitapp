/**
 * @file src/services/registro.service.ts
 * @description Service Layer para registros diarios — llamadas pasan por apiClient hacia NestJS.
 * @layer Business Logic (Capa 3)
 * La validación de negocio (fecha hoy, progreso, ownership) vive en el backend.
 */

import { apiClient } from "@/lib/api/client";
import type { Result } from "@/lib/result";

export class RegistroService {
  // ─── getByHabito ───────────────────────────────────────────────────────────
  async getByHabito(habitoId: string): Promise<Result<any[]>> {
    return apiClient.get<any[]>(`records/habito/${habitoId}`);
  }

  // ─── getHistorialUsuario ───────────────────────────────────────────────────
  async getHistorialUsuario(): Promise<Result<any[]>> {
    return apiClient.get<any[]>("records/historial");
  }

  // ─── marcarCompletado ──────────────────────────────────────────────────────
  async marcarCompletado(dto: {
    idHabito: string;
    observacion?: string;
  }): Promise<Result<any>> {
    return apiClient.post<any>("records/completar", dto);
  }

  // ─── desmarcarCompletado ───────────────────────────────────────────────────
  async desmarcarCompletado(habitoId: string): Promise<Result<any>> {
    return apiClient.delete<any>(`records/desmarcar/${habitoId}`);
  }

  // ─── avanzarProgreso ───────────────────────────────────────────────────────
  async avanzarProgreso(dto: {
    idHabito: string;
    cantidadASumar: number;
    observacion?: string;
  }): Promise<Result<any>> {
    return apiClient.patch<any>("records/progreso", dto);
  }

  // ─── getRacha ──────────────────────────────────────────────────────────────
  async getRacha(habitoId: string): Promise<Result<any>> {
    return apiClient.get<any>(`records/racha/${habitoId}`);
  }
}
