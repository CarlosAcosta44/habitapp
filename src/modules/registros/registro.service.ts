/**
 * @file src/modules/registros/registro.service.ts
 * @description Service Layer para registros diarios y rachas.
 *
 * @pattern Service Layer
 * @principle SRP — solo lógica de negocio de registros
 */

import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import { RegistroRepository } from "./registro.repository";
import type {
  RegistroHabito,
  RegistroConHabito,
  RachaActual,
  MarcarCompletadoDTO,
} from "./types";

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
  /**
   * REGLAS DE NEGOCIO:
   * 1. Solo se puede marcar el día actual
   * 2. No se puede marcar un hábito ya completado hoy
   */
  async marcarCompletado(
    dto: MarcarCompletadoDTO
  ): Promise<Result<RegistroHabito>> {
    const hoy = new Date().toISOString().split("T")[0];

    // Regla 1: solo el día actual
    if (dto.fecha !== hoy) {
      return err("Solo puedes registrar el progreso del día actual");
    }

    // Regla 2: verificar si ya está completado hoy
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