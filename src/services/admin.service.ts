import { adminRepository } from "@/repositories/admin.repository";
import type { Result } from '@/lib/result';
import type { UserProfileDto, UserRole, PaginatedUsersResponse } from '@/domain/usuario.types';

export const adminService = {
  /**
   * Obtiene la lista de usuarios para el panel de administración, con paginación opcional.
   * Llama a GET /admin/users?page={page}&limit={limit}
   */
  async getUsers(page: number = 1, limit: number = 10): Promise<Result<PaginatedUsersResponse>> {
    const endpoint = `admin/users?page=${page}&limit=${limit}`;
    const result = await adminRepository.get<any>(endpoint);
    if (!result.success) {
      return result;
    }
    // Si la respuesta es un array plano (retrocompatibilidad) o paginada { data, meta }
    if (Array.isArray(result.data)) {
      return {
        success: true,
        data: {
          data: result.data,
          meta: {
            total: result.data.length,
            page: 1,
            limit: result.data.length,
            totalPages: 1,
          },
        },
      };
    }
    return result as Result<PaginatedUsersResponse>;
  },

  /**
   * Actualiza el rol de un usuario.
   * Llama a PATCH /admin/users/:id/role
   */
  async updateUserRole(userId: string, newRole: UserRole | string): Promise<Result<any>> {
    return adminRepository.patch(`admin/users/${userId}/role`, { role: newRole });
  },

  /**
   * Actualiza el estado de cuenta de un usuario (Activo, Suspendido, Pendiente).
   * Llama a PATCH /admin/users/:id/status
   */
  async updateUserStatus(userId: string, newStatus: string): Promise<Result<any>> {
    return adminRepository.patch(`admin/users/${userId}/status`, { estado: newStatus });
  },

  /**
   * Elimina un foro y todos sus comentarios en cascada.
   * Llama a DELETE /admin/forum/:id
   */
  async deleteForum(forumId: string): Promise<Result<any>> {
    return adminRepository.delete(`admin/forum/${forumId}`);
  },

  /**
   * Elimina un comentario específico de un foro.
   * Llama a DELETE /admin/forum/comments/:id
   */
  async deleteForumComment(commentId: string): Promise<Result<any>> {
    return adminRepository.delete(`admin/forum/comments/${commentId}`);
  },
};
