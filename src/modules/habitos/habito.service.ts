/**
 * @file src/modules/habitos/habito.service.ts
 * @description Service Layer para la lógica de negocio de Hábitos.
 *
 * Responsabilidades:
 * - Aplicar reglas de negocio antes de llamar al repositorio
 * - Validar estados y restricciones de dominio
 * - Retornar Result<T> estandarizado
 *
 * @pattern Service Layer
 * @principle SRP — solo lógica de negocio de hábitos
 * @principle DIP — depende de IRepository, no de HabitoRepository directamente
 */

import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import { HabitoRepository } from "./habito.repository";
import type {
  Habito,
  HabitoConCategoria,
  HabitoConProgreso,
  CreateHabitoDTO,
  UpdateHabitoDTO,
  HabitoFilters,
  CategoriaHabito,
} from "./types";

export class HabitoService {
  private readonly repo: HabitoRepository;

  constructor(repo?: HabitoRepository) {
    this.repo = repo ?? new HabitoRepository();
  }

  // ─── getAll ────────────────────────────────────────────────────────────────
  async getAll(): Promise<Result<HabitoConCategoria[]>> {
    return this.repo.findAll();
  }

  // ─── getById ───────────────────────────────────────────────────────────────
  async getById(id: string): Promise<Result<HabitoConCategoria>> {
    const result = await this.repo.findById(id);
    if (!result.success) return err(result.error);
    if (!result.data)    return err(`Hábito con ID ${id} no encontrado`);
    return ok(result.data);
  }

  // ─── getByUsuario ──────────────────────────────────────────────────────────
  async getByUsuario(
    usuarioId: string,
    filters?: HabitoFilters
  ): Promise<Result<HabitoConCategoria[]>> {
    if (!usuarioId) return err("El ID del usuario es requerido");
    return this.repo.findByUserId(usuarioId, filters);
  }

  // ─── getDashboard ──────────────────────────────────────────────────────────
  /**
   * Trae los hábitos activos del usuario con el progreso de hoy.
   * Es el método principal del dashboard del usuario.
   */
  async getDashboard(
    usuarioId: string
  ): Promise<Result<HabitoConProgreso[]>> {
    if (!usuarioId) return err("El ID del usuario es requerido");
    return this.repo.findByUserIdConProgreso(usuarioId);
  }

  // ─── getCategorias ─────────────────────────────────────────────────────────
  async getCategorias(): Promise<Result<CategoriaHabito[]>> {
    return this.repo.findCategorias();
  }

  // ─── create ────────────────────────────────────────────────────────────────
  /**
   * REGLAS DE NEGOCIO:
   * 1. La fecha de fin debe ser posterior a la fecha de inicio
   * 2. Los puntos deben estar entre 1 y 100
   * 3. El nombre no puede estar vacío
   */
  async create(dto: CreateHabitoDTO): Promise<Result<Habito>> {
    // Regla 1: validar fechas
    if (dto.fechaFin && dto.fechaFin <= dto.fechaInicio) {
      return err("La fecha de fin debe ser posterior a la fecha de inicio");
    }

    // Regla 2: validar puntos
    if (dto.puntos < 1 || dto.puntos > 100) {
      return err("Los puntos deben estar entre 1 y 100");
    }

    // Regla 3: validar nombre
    if (!dto.nombre.trim()) {
      return err("El nombre del hábito no puede estar vacío");
    }

    return this.repo.create({
      ...dto,
      estado: "Activo",
      fechaInicio: dto.fechaInicio || new Date().toISOString().split("T")[0],
    });
  }

  // ─── update ────────────────────────────────────────────────────────────────
  async update(
    id: string,
    updates: UpdateHabitoDTO
  ): Promise<Result<Habito>> {
    // Verificar que existe
    const existe = await this.repo.findById(id);
    if (!existe.success) return err(existe.error);
    if (!existe.data)    return err(`Hábito con ID ${id} no encontrado`);

    // Regla: no se puede reactivar un hábito completado
    if (existe.data.estado === "Completado" && updates.estado === "Activo") {
      return err("No se puede reactivar un hábito ya completado");
    }

    // Regla: validar fechas si se actualizan
    if (updates.fechaFin && updates.fechaFin <= existe.data.fechaInicio) {
      return err("La fecha de fin debe ser posterior a la fecha de inicio");
    }

    const result = await this.repo.update(id, updates);
    if (!result.success) return err(result.error);
    if (!result.data)    return err("Error al actualizar el hábito");
    return ok(result.data);
  }

  async delete(id: string): Promise<Result<boolean>> {
    // Permitimos borrar cualquier hábito sin importar su estado (Limpieza física)
    return this.repo.delete(id);
  }

  // ─── completar ─────────────────────────────────────────────────────────────
  /**
   * Marca un hábito como Completado definitivamente.
   */
  async completar(id: string): Promise<Result<Habito>> {
    return this.update(id, { estado: "Completado" });
  }
}