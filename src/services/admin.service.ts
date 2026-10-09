import { adminRepository } from "@/repositories/admin.repository";
import type { Result } from '@/lib/result';
import type { UserProfileDto, UserRole } from '@/domain/usuario.types';

export const adminService = {
  /**
   * Obtiene la lista completa de usuarios para el panel de administración.
   * Llama a GET /admin/users
   */
  async getUsers(): Promise<Result<UserProfileDto[]>> {
    return adminRepository.get<UserProfileDto[]>('admin/users');
  },

  /**
   * Actualiza el rol de un usuario.
   * Llama a PATCH /admin/users/:id/role
   */
  async updateUserRole(userId: string, newRole: UserRole | string): Promise<Result<any>> {
    return adminRepository.patch(`admin/users/${userId}/role`, { role: newRole });
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
