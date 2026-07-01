/**
 * @file src/services/reportes.service.ts
 * @description Service Layer para el módulo de Reportes y Ranking.
 * Consumo 100% a través de la API REST del backend.
 * @layer Business Logic (Capa 3)
 */

import { apiClient } from "@/lib/api/client";
import { ok, err } from "@/lib/result";
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

  async getRanking(userId: string): Promise<Result<RankingUsuario[]>> {
    const res = await apiClient.get<any[]>('/reports/ranking');
    if (!res.success) return err(res.error);

    const data: RankingUsuario[] = res.data.map((row: any, index: number) => ({
      posicion: row.posicion || index + 1,
      nombre: row.nombre || 'Usuario',
      apellido: row.apellido || '',
      fotoPerfil: row.fotoperfil || null,
      puntosTotales: row.puntostotales || 0,
      habitoPrincipal: row.habitoprincipal || null,
      esUsuarioActual: row.idusuario === userId,
    }));

    return ok(data);
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
