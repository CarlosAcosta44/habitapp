/**
 * @file src/modules/reportes/reportes.service.ts
 * @description Service Layer para el módulo de Reportes y Ranking.
 */

import { ok, err }       from "@/lib/result";
import type { Result }   from "@/lib/result";
import { ReportesRepository } from "./reportes.repository";
import type {
  EstadisticasGlobales,
  HabitoReporte,
  RankingUsuario,
} from "./types";

export class ReportesService {
  private readonly repo: ReportesRepository;

  constructor(repo?: ReportesRepository) {
    this.repo = repo ?? new ReportesRepository();
  }

  async getEstadisticas(userId: string): Promise<Result<EstadisticasGlobales>> {
    if (!userId) return err("ID del usuario requerido");
    return this.repo.findEstadisticas(userId);
  }

  async getRanking(userId: string): Promise<Result<RankingUsuario[]>> {
    if (!userId) return err("ID del usuario requerido");
    return this.repo.findRanking(userId);
  }

  async getHabitosReporte(userId: string): Promise<Result<HabitoReporte[]>> {
    if (!userId) return err("ID del usuario requerido");
    return this.repo.findHabitosConProgreso(userId);
  }
}
