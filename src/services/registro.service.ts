/**
 * @file src/services/registro.service.ts
 * @description Service Layer para registros diarios y rachas.
 * @layer Business Logic (Capa 3)
 * @pattern Service Layer
 * @principle SRP — solo lógica de negocio de registros
 */

import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import { RegistroRepository } from "@/repositories/registro.repository";
import type {
  RegistroHabito,
  RegistroConHabito,
  RachaActual,
  MarcarCompletadoDTO,
  AvanzarProgresoDTO,
} from "@/types/domain/registro.types";

export class RegistroService {
  private readonly repo: RegistroRepository;

  constructor(repo?: RegistroRepository) {
    this.repo = repo ?? new RegistroRepository();
  }

  // ─── getByHabito ───────────────────────────────────────────────────────────
  async getByHabito(habitoId: string): Promise<Result<RegistroHabito[]>> {
    if (!habitoId) return err("El ID del hábito es requerido");
    return this.repo.findByHabitoId(habitoId);
  }

  // ─── getHistorialUsuario ───────────────────────────────────────────────────
  async getHistorialUsuario(
    usuarioId: string
  ): Promise<Result<RegistroConHabito[]>> {
    if (!usuarioId) return err("El ID del usuario es requerido");
    return this.repo.findByUsuarioId(usuarioId);
  }

  // ─── marcarCompletado ──────────────────────────────────────────────────────
  async marcarCompletado(
    dto: MarcarCompletadoDTO
  ): Promise<Result<RegistroHabito>> {
    const hoy = new Date().toISOString().split("T")[0];

    if (dto.fecha !== hoy) {
      return err("Solo puedes registrar el progreso del día actual");
    }

    const registroHoy = await this.repo.findHoy(dto.idHabito, dto.idUsuario);
    if (registroHoy.success && registroHoy.data?.completado) {
      return err("Este hábito ya fue completado hoy");
    }

    return this.repo.marcarCompletado(dto);
  }

  // ─── desmarcarCompletado ───────────────────────────────────────────────────
  async desmarcarCompletado(
    habitoId:  string,
    usuarioId: string
  ): Promise<Result<RegistroHabito>> {
    const registroHoy = await this.repo.findHoy(habitoId, usuarioId);
    if (!registroHoy.success) return err(registroHoy.error);
    if (!registroHoy.data)    return err("No hay registro de hoy para desmarcar");
    if (!registroHoy.data.completado) {
      return err("Este hábito no está marcado como completado hoy");
    }
    return this.repo.desmarcarCompletado(habitoId, usuarioId);
  }

  // ─── avanzarProgreso ───────────────────────────────────────────────────────
  async avanzarProgreso(
    dto: AvanzarProgresoDTO
  ): Promise<Result<RegistroHabito>> {
    const hoy = new Date().toISOString().split("T")[0];

    if (dto.fecha !== hoy) {
      return err("Solo puedes registrar el progreso del día actual");
    }
    if (dto.cantidadAsumar <= 0) {
      return err("La cantidad a sumar debe ser mayor a cero");
    }

    return this.repo.avanzarProgreso(dto);
  }

  // ─── getRacha ──────────────────────────────────────────────────────────────
  async getRacha(
    habitoId:  string,
    usuarioId: string
  ): Promise<Result<RachaActual>> {
    if (!habitoId || !usuarioId) {
      return err("IDs de hábito y usuario son requeridos");
    }
    return this.repo.calcularRacha(habitoId, usuarioId);
  }
}
