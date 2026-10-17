/**
 * @file src/services/habito.service.ts
 * @description Service Layer para hábitos — todas las llamadas pasan por apiClient hacia NestJS.
 * @layer Business Logic (Capa 3)
 * La validación de reglas de negocio (fechas, puntos, ownership) vive en el backend.
 * Este servicio solo orquesta las llamadas y transforma respuestas.
 */

import { habitoRepository } from "@/repositories/habito.repository";
import type { Result } from "@/lib/result";

export class HabitoService {
  // ─── getDashboard ──────────────────────────────────────────────────────────
  async getDashboard(): Promise<Result<any[]>> {
    return habitoRepository.get<any[]>("users/habits/dashboard");
  }

  // ─── getCategorias ─────────────────────────────────────────────────────────
  async getCategorias(): Promise<Result<any[]>> {
    return habitoRepository.get<any[]>("users/habits/categorias");
  }

  // ─── getAll ────────────────────────────────────────────────────────────────
  async getAll(estado?: string): Promise<Result<any[]>> {
    const url = estado ? `users/habits?estado=${estado}` : "users/habits";
    return habitoRepository.get<any[]>(url);
  }

  // ─── getById ───────────────────────────────────────────────────────────────
  async getById(id: string): Promise<Result<any>> {
    return habitoRepository.get<any>(`users/habits/${id}`);
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
    diasSemana?: number[];
  }): Promise<Result<any>> {
    return habitoRepository.post<any>("users/habits", dto);
  }

  // ─── update ────────────────────────────────────────────────────────────────
  async update(id: string, updates: {
    nombre?: string;
    descripcion?: string;
    fechaFin?: string;
    estado?: string;
    puntos?: number;
    idCategoria?: string;
    metaDiaria?: number;
    unidadMedida?: string;
  }): Promise<Result<any>> {
    return habitoRepository.patch<any>(`users/habits/${id}`, updates);
  }

  // ─── completar ─────────────────────────────────────────────────────────────
  async completar(id: string): Promise<Result<any>> {
    return habitoRepository.patch<any>(`users/habits/${id}/completar`, {});
  }

  // ─── delete ────────────────────────────────────────────────────────────────
  async delete(id: string): Promise<Result<any>> {
    return habitoRepository.delete<any>(`users/habits/${id}`);
  }
}
