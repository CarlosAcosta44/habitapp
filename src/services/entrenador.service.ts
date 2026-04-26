/**
 * @file src/services/entrenador.service.ts
 * @description Service Layer para el módulo de Entrenadores.
 * @layer Business Logic (Capa 3)
 */

import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import { EntrenadorRepository } from "@/repositories/entrenador.repository";
import type {
  EntrenadorConPerfil,
  Rutina,
  RutinaConUsuarios,
  Seguimiento,
  CreateRutinaDTO,
  CreateSeguimientoDTO,
  AsignarRutinaDTO,
} from "@/types/domain/entrenador.types";

export class EntrenadorService {
  private readonly repo: EntrenadorRepository;

  constructor(repo?: EntrenadorRepository) {
    this.repo = repo ?? new EntrenadorRepository();
  }

  async getPerfil(entrenadorId: string): Promise<Result<EntrenadorConPerfil>> {
    const result = await this.repo.findById(entrenadorId);
    if (!result.success) return err(result.error);
    if (!result.data)    return err("Entrenador no encontrado");
    return ok(result.data);
  }

  async getPerfilByUsuario(usuarioId: string): Promise<Result<EntrenadorConPerfil>> {
    const result = await this.repo.findByUsuarioId(usuarioId);
    if (!result.success) return err(result.error);
    if (!result.data)    return err("No tienes perfil de entrenador");

    return this.getPerfil(result.data.idEntrenador);
  }

  async getMisUsuarios(entrenadorId: string): Promise<Result<{
    idUsuario: string;
    nombre:    string;
    apellido:  string;
    fechaInicio: string;
  }[]>> {
    if (!entrenadorId) return err("ID del entrenador requerido");
    return this.repo.findUsuariosAsignados(entrenadorId);
  }

  async getMisRutinas(
    entrenadorId: string
  ): Promise<Result<RutinaConUsuarios[]>> {
    if (!entrenadorId) return err("ID del entrenador requerido");
    return this.repo.findRutinasConUsuarios(entrenadorId);
  }

  async createRutina(dto: CreateRutinaDTO): Promise<Result<Rutina>> {
    if (!dto.tipo.trim()) {
      return err("El tipo de rutina no puede estar vacío");
    }
    if (dto.duracion !== null && dto.duracion !== undefined && dto.duracion <= 0) {
      return err("La duración debe ser un valor positivo");
    }

    return this.repo.createRutina(dto);
  }

  async asignarRutina(
    dto:          AsignarRutinaDTO,
    entrenadorId: string
  ): Promise<Result<boolean>> {
    const usuarios = await this.repo.findUsuariosAsignados(entrenadorId);
    if (!usuarios.success) return err(usuarios.error);

    const esMiUsuario = usuarios.data.some((u) => u.idUsuario === dto.idUsuario);
    if (!esMiUsuario) {
      return err("Solo puedes asignar rutinas a tus usuarios registrados");
    }

    return this.repo.asignarRutina(dto);
  }

  async registrarSeguimiento(
    dto: CreateSeguimientoDTO
  ): Promise<Result<Seguimiento>> {
    if (!dto.progreso && !dto.observaciones) {
      return err("Debes incluir al menos el progreso o las observaciones");
    }

    return this.repo.createSeguimiento(dto);
  }

  async getSeguimientos(
    usuarioId:    string,
    entrenadorId: string
  ): Promise<Result<Seguimiento[]>> {
    return this.repo.findSeguimientosByUsuario(usuarioId, entrenadorId);
  }
}
