/**
 * @file src/services/reportes.service.ts
 * @description Service Layer para el módulo de Reportes y Ranking.
 * Consumo 100% a través de la API REST del backend.
 * @layer Business Logic (Capa 3)
 */

import { apiClient } from "@/lib/api/client";
import type { Result } from "@/lib/result";
import type {
  HabitoReporte,
  RankingUsuario,
} from "@/types/domain/reportes.types";

export interface ComparativaGraphed {
  diasSemana: string[];
  data: {
    categoriaId: string;
    vals: number[];
  }[];
}

export interface BackendUserSummary {
  userId: string;
  nombre: string;
  puntos_totales: number;
  habitos_activos: number;
  completados_hoy: number;
  tasa_diaria: number;
}

export class ReportesService {
  async getEstadisticas(userId: string): Promise<Result<BackendUserSummary>> {
    return apiClient.get<BackendUserSummary>(`/reports/user/${userId}`);
  }

  async getRanking(): Promise<Result<RankingUsuario[]>> {
    return apiClient.get<RankingUsuario[]>('/reports/ranking');
  }

  // TODO: Estos endpoints deben ser implementados en el backend para reemplazar las
  // antiguas consultas directas a la base de datos vía Supabase.
  async getHabitosReporte(userId: string): Promise<Result<HabitoReporte[]>> {
    return apiClient.get<HabitoReporte[]>(`/reports/user/${userId}/habits`);
  }

  async getComparativaSemanal(userId: string): Promise<Result<ComparativaGraphed>> {
    return apiClient.get<ComparativaGraphed>(`/reports/user/${userId}/comparative`);
  }
}
