/**
 * @file src/services/comunidad.service.ts
 * @description Service Layer para Comunidad y Bienestar — llamadas pasan por apiClient hacia NestJS.
 * @layer Business Logic (Capa 3)
 */

import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import { comunidadRepository } from "@/repositories/comunidad.repository";
import type { Reto } from "@/domain/reto.types";

export class ComunidadService {
  constructor() {}

  // ─── Estadísticas de Comunidad ──────────────────────────────────────────────
  async getStats(): Promise<Result<{ totalMiembros: number; conectados: number }>> {
    try {
      return await comunidadRepository.get<{ totalMiembros: number; conectados: number }>('users/community/stats');
    } catch (e: any) {
      return ok({ totalMiembros: 30, conectados: 30 });
    }
  }

  // ─── Foros ──────────────────────────────────────────────────────────────────
  async getForos(): Promise<Result<any[]>> {
    try {
      return await comunidadRepository.get<any[]>('users/community/foros');
    } catch (e: any) {
      return err(`Error al obtener foros: ${e.message}`);
    }
  }

  async getForoById(foroId: string): Promise<Result<any>> {
    if (!foroId) return err("ID del foro requerido");
    try {
      const res = await comunidadRepository.get<any>(`users/community/foros/${foroId}`);
      if (res.success && res.data) {
        return res;
      }
      // Fallback: buscar en la lista general de foros
      const allRes = await this.getForos();
      if (allRes.success && Array.isArray(allRes.data)) {
        const found = allRes.data.find(
          (f: any) => String(f.idforo || f.idForo || f.id || f.id_foro) === String(foroId)
        );
        if (found) return ok(found);
      }
      return err("Foro no encontrado");
    } catch (e: any) {
      return err(`Error al obtener foro: ${e.message}`);
    }
  }

  async getComentarios(foroId: string): Promise<Result<any[]>> {
    if (!foroId) return err("ID del foro requerido");
    try {
      return await comunidadRepository.get<any[]>(`users/community/foros/${foroId}/comentarios`);
    } catch (e: any) {
      return err(`Error al obtener comentarios: ${e.message}`);
    }
  }

  async createForo(dto: {
    titulo: string;
    descripcion: string;
    categoria: string;
    imagenUrl?: string;
  }): Promise<Result<any>> {
    if (!dto.titulo?.trim()) return err("El título es obligatorio");
    if (!dto.descripcion?.trim()) return err("La descripción es obligatoria");
    try {
      return await comunidadRepository.post<any>('users/community/foros', dto);
    } catch (e: any) {
      return err(`Error al crear foro: ${e.message}`);
    }
  }

  async comentar(dto: {
    idForo: string;
    contenido: string;
    idComentarioPadre?: string | null;
    imagenUrl?: string | null;
  }): Promise<Result<any>> {
    if (!dto.contenido?.trim() && !dto.imagenUrl) return err("El comentario no puede estar vacío");
    try {
      return await comunidadRepository.post<any>(`users/community/foros/${dto.idForo}/comentarios`, {
        contenido: (dto.contenido || '').trim(),
        parentId: dto.idComentarioPadre || undefined,
        imagenUrl: dto.imagenUrl || undefined,
      });
    } catch (e: any) {
      return err(`Error al crear comentario: ${e.message}`);
    }
  }

  async reaccionar(dto: {
    targetType: 'comentario' | 'articulo' | 'foro';
    targetId: string;
    tipo?: string;
  }): Promise<Result<any>> {
    try {
      return await comunidadRepository.post<any>(
        `users/community/${dto.targetType}/${dto.targetId}/reacciones`,
        { tipo: dto.tipo || 'like' }
      );
    } catch (e: any) {
      return err(`Error al reaccionar: ${e.message}`);
    }
  }

  // ─── Artículos ───────────────────────────────────────────────────────────────
  async getArticulos(): Promise<Result<any[]>> {
    try {
      return await comunidadRepository.get<any[]>('users/community/articulos');
    } catch (e: any) {
      return err(`Error al obtener artículos: ${e.message}`);
    }
  }

  // ─── Especialistas ──────────────────────────────────────────────────────────
  async getEspecialistas(): Promise<Result<any[]>> {
    try {
      return await comunidadRepository.get<any[]>('users/community/especialistas');
    } catch (e: any) {
      return err(`Error al obtener especialistas: ${e.message}`);
    }
  }

  async updateForo(
    foroId: string,
    updates: { titulo?: string; descripcion?: string; categoria?: string; imagenUrl?: string }
  ): Promise<Result<any>> {
    if (!foroId) return err("ID del foro requerido");
    try {
      return await comunidadRepository.put<any>(`users/community/foros/${foroId}`, updates);
    } catch (e: any) {
      return err(`Error al actualizar foro: ${e.message}`);
    }
  }

  async deleteForo(foroId: string): Promise<Result<any>> {
    if (!foroId) return err("ID del foro requerido");
    try {
      return await comunidadRepository.delete<any>(`users/community/foros/${foroId}`);
    } catch (e: any) {
      return err(`Error al eliminar foro: ${e.message}`);
    }
  }

  async updateComentario(comentarioId: string, contenido: string): Promise<Result<any>> {
    if (!comentarioId) return err("ID del comentario requerido");
    try {
      return await comunidadRepository.put<any>(`users/community/comentarios/${comentarioId}`, { contenido });
    } catch (e: any) {
      return err(`Error al actualizar comentario: ${e.message}`);
    }
  }

  async deleteComentario(comentarioId: string): Promise<Result<any>> {
    if (!comentarioId) return err("ID del comentario requerido");
    try {
      return await comunidadRepository.delete<any>(`users/community/comentarios/${comentarioId}`);
    } catch (e: any) {
      return err(`Error al eliminar comentario: ${e.message}`);
    }
  }

  // ─── Retos Comunitarios ─────────────────────────────────────────────────────
  async getRetos(): Promise<Result<Reto[]>> {
    try {
      return await comunidadRepository.get<Reto[]>('users/community/retos');
    } catch (e: any) {
      return err(`Error al obtener retos: ${e.message}`);
    }
  }

  async joinReto(retoId: string): Promise<Result<any>> {
    try {
      return await comunidadRepository.post<any>(`users/community/retos/${retoId}/unirse`, {});
    } catch (e: any) {
      return err(`Error al unirse al reto: ${e.message}`);
    }
  }

  async leaveReto(retoId: string): Promise<Result<any>> {
    try {
      return await comunidadRepository.post<any>(`users/community/retos/${retoId}/salir`, {});
    } catch (e: any) {
      return err(`Error al salir del reto: ${e.message}`);
    }
  }

  async checkinReto(retoId: string): Promise<Result<any>> {
    try {
      return await comunidadRepository.post<any>(`users/community/retos/${retoId}/checkin`, {});
    } catch (e: any) {
      return err(`Error al registrar avance en el reto: ${e.message}`);
    }
  }

  async createReto(dto: {
    titulo: string;
    descripcion: string;
    puntosRecompensa?: number;
    fechaInicio?: string;
    fechaFin?: string;
    insigniaRecompensa?: string;
    icono?: string;
    diasObjetivo?: number;
  }): Promise<Result<any>> {
    if (!dto.titulo?.trim()) return err("El título del reto es requerido");
    if (!dto.descripcion?.trim()) return err("La descripción es requerida");
    try {
      return await comunidadRepository.post<any>('users/community/retos', dto);
    } catch (e: any) {
      return err(`Error al crear reto: ${e.message}`);
    }
  }

  // ─── Hábitos de la Comunidad ────────────────────────────────────────────────
  async getHabitosComunidad(): Promise<Result<any[]>> {
    try {
      return await comunidadRepository.get<any[]>('users/community/habitos');
    } catch (e: any) {
      return err(`Error al obtener hábitos comunitarios: ${e.message}`);
    }
  }

  async clonarHabito(idHabito: string): Promise<Result<any>> {
    try {
      return await comunidadRepository.post<any>(`users/community/habitos/${idHabito}/clonar`, {});
    } catch (e: any) {
      return err(`Error al clonar hábito: ${e.message}`);
    }
  }

  async compartirHabito(idHabito: string): Promise<Result<any>> {
    try {
      return await comunidadRepository.post<any>(`users/community/habitos/${idHabito}/compartir`, {});
    } catch (e: any) {
      return err(`Error al compartir hábito: ${e.message}`);
    }
  }
}
