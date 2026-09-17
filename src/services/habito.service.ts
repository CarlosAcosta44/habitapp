/**
 * @file src/services/habito.service.ts
 * @description Service Layer para hábitos — todas las llamadas pasan por apiClient hacia NestJS.
 * @layer Business Logic (Capa 3)
 * La validación de reglas de negocio (fechas, puntos, ownership) vive en el backend.
 * Este servicio solo orquesta las llamadas y transforma respuestas.
 */

import { apiClient } from "@/lib/api/client";
import type { Result } from "@/lib/result";

export class HabitoService {
  // ─── getDashboard ──────────────────────────────────────────────────────────
  async getDashboard(): Promise<Result<any[]>> {
    return apiClient.get<any[]>("habits/dashboard");
  }

  // ─── getCategorias ─────────────────────────────────────────────────────────
  async getCategorias(): Promise<Result<any[]>> {
    return apiClient.get<any[]>("habits/categorias");
  }

  // ─── getAll ────────────────────────────────────────────────────────────────
  async getAll(estado?: string): Promise<Result<any[]>> {
    const url = estado ? `habits?estado=${estado}` : "habits";
    return apiClient.get<any[]>(url);
  }

  // ─── getById ───────────────────────────────────────────────────────────────
  async getById(id: string): Promise<Result<any>> {
    return apiClient.get<any>(`habits/${id}`);
  }

  // ─── create ────────────────────────────────────────────────────────────────
  async create(dto: {
    nombre: string;
    descripcion?: string;
    fechaInicio: string;
    fechaFin?: string;
    puntos: number;
    metaDiaria?: number;
    unidadMedida?: string;
    idCategoria: string;
  }): Promise<Result<any>> {
    return apiClient.post<any>("habits", dto);
  }

  // ─── update ────────────────────────────────────────────────────────────────
  async update(id: string, updates: {
    nombre?: string;
    descripcion?: string;
    fechaFin?: string;
    estado?: string;
    puntos?: number;
    idCategoria?: string;
  }): Promise<Result<any>> {
    return apiClient.patch<any>(`habits/${id}`, updates);
  }

  // ─── completar ─────────────────────────────────────────────────────────────
  async completar(id: string): Promise<Result<any>> {
    return apiClient.patch<any>(`habits/${id}/completar`, {});
  }

  // ─── delete ────────────────────────────────────────────────────────────────
  async delete(id: string): Promise<Result<any>> {
    return apiClient.delete<any>(`habits/${id}`);
  }
}
