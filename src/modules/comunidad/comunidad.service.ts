/**
 * @file src/modules/comunidad/comunidad.service.ts
 * @description Service Layer para el módulo de Comunidad.
 *
 * @pattern Service Layer
 * @principle SRP — solo lógica de negocio de comunidad
 */

import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import { ComunidadRepository } from "./comunidad.repository";
import type {
  Foro,
  ForoConMetricas,
  Comentario,
  ComentarioConAutor,
  Articulo,
  CreateComentarioDTO,
  CreateReaccionDTO,
} from "./types";

export class ComunidadService {
  private readonly repo: ComunidadRepository;

  constructor(repo?: ComunidadRepository) {
    this.repo = repo ?? new ComunidadRepository();
  }

  // ─── getForos ──────────────────────────────────────────────────────────────
  async getForos(usuarioId: string): Promise<Result<ForoConMetricas[]>> {
    if (!usuarioId) return err("ID del usuario requerido");
    return this.repo.findForos(usuarioId);
  }

  // ─── getComentarios ────────────────────────────────────────────────────────
  async getComentarios(
    foroId: string
  ): Promise<Result<ComentarioConAutor[]>> {
    if (!foroId) return err("ID del foro requerido");
    return this.repo.findComentariosByForo(foroId);
  }

  // ─── comentar ──────────────────────────────────────────────────────────────
  /**
   * REGLAS DE NEGOCIO:
   * 1. El contenido no puede estar vacío
   * 2. Las respuestas solo pueden ser de primer nivel (no se anidan más de 1 nivel)
   */
  async comentar(dto: CreateComentarioDTO): Promise<Result<Comentario>> {
    if (!dto.contenido.trim()) {
      return err("El comentario no puede estar vacío");
    }
    if (dto.contenido.length > 500) {
      return err("El comentario no puede superar 500 caracteres");
    }

    // Regla: máximo 1 nivel de anidación
    if (dto.idComentarioPadre) {
      const comentarios = await this.repo.findComentariosByForo(dto.idForo);
      if (comentarios.success) {
        const padre = comentarios.data.find(
          (c) => c.idComentario === dto.idComentarioPadre
        );
        if (padre?.idComentarioPadre) {
          return err("No se pueden anidar respuestas más de un nivel");
        }
      }
    }

    return this.repo.createComentario(dto);
  }

  // ─── reaccionar ────────────────────────────────────────────────────────────
  async reaccionar(dto: CreateReaccionDTO): Promise<Result<boolean>> {
    if (!dto.idComentario && !dto.idArticulo) {
      return err("Debes especificar un comentario o artículo");
    }
    return this.repo.toggleReaccion(dto);
  }

  // ─── suscribirse ───────────────────────────────────────────────────────────
  async suscribirse(
    usuarioId: string,
    foroId:    string
  ): Promise<Result<boolean>> {
    return this.repo.suscribirseAForo(usuarioId, foroId);
  }

  // ─── desuscribirse ─────────────────────────────────────────────────────────
  async desuscribirse(
    usuarioId: string,
    foroId:    string
  ): Promise<Result<boolean>> {
    return this.repo.desuscribirseAForo(usuarioId, foroId);
  }

  // ─── getArticulos ──────────────────────────────────────────────────────────
  async getArticulos(): Promise<Result<Articulo[]>> {
    return this.repo.findArticulosPublicados();
  }
}