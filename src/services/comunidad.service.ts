import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import { apiClient } from "@/lib/api/client";
import type {
  Foro,
  ForoConMetricas,
  Comentario,
  ComentarioConAutor,
  Articulo,
  HabitoPopular,
  EntrenadorPublico,
  CreateComentarioDTO,
  CreateReaccionDTO,
} from "@/types/domain/comunidad.types";

export class ComunidadService {
  constructor() {}

  async getForos(usuarioId: string): Promise<Result<ForoConMetricas[]>> {
    if (!usuarioId) return err("ID del usuario requerido");
    try {
      return await apiClient.get<ForoConMetricas[]>('/community/forums');
    } catch (e: any) {
      return err(`Error al obtener foros: ${e.message}`);
    }
  }

  async getComentarios(foroId: string): Promise<Result<ComentarioConAutor[]>> {
    if (!foroId) return err("ID del foro requerido");
    try {
      return await apiClient.get<ComentarioConAutor[]>(`/community/forums/${foroId}/comments`);
    } catch (e: any) {
      return err(`Error al obtener comentarios: ${e.message}`);
    }
  }

  async comentar(dto: CreateComentarioDTO): Promise<Result<Comentario>> {
    if (!dto.contenido.trim()) return err("El comentario no puede estar vacío");
    if (dto.contenido.length > 500) return err("El comentario no puede superar 500 caracteres");

    try {
      return await apiClient.post<Comentario>('/community/comments', dto);
    } catch (e: any) {
      return err(`Error al crear comentario: ${e.message}`);
    }
  }

  async reaccionar(dto: CreateReaccionDTO): Promise<Result<boolean>> {
    if (!dto.idComentario && !dto.idArticulo) {
      return err("Debes especificar un comentario o artículo");
    }
    try {
      return await apiClient.post<boolean>('/community/react', dto);
    } catch (e: any) {
      return err(`Error al reaccionar: ${e.message}`);
    }
  }

  async suscribirse(usuarioId: string, foroId: string): Promise<Result<boolean>> {
    try {
      return await apiClient.post<boolean>(`/community/forums/${foroId}/subscribe`);
    } catch (e: any) {
      return err(`Error al suscribirse al foro: ${e.message}`);
    }
  }

  async desuscribirse(usuarioId: string, foroId: string): Promise<Result<boolean>> {
    try {
      await apiClient.delete(`/community/forums/${foroId}/subscribe`);
      return ok(true);
    } catch (e: any) {
      return err(`Error al desuscribirse del foro: ${e.message}`);
    }
  }

  async getArticulos(limit?: number): Promise<Result<Articulo[]>> {
    try {
      let url = '/community/articles';
      if (limit) url += `?limit=${limit}`;
      return await apiClient.get<Articulo[]>(url);
    } catch (e: any) {
      return err(`Error al obtener artículos: ${e.message}`);
    }
  }

  async getEntrenadores(): Promise<Result<EntrenadorPublico[]>> {
    try {
      return await apiClient.get<EntrenadorPublico[]>('/community/trainers');
    } catch (e: any) {
      return err(`Error al obtener entrenadores: ${e.message}`);
    }
  }
}
