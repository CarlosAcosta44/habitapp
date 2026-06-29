import { apiClient } from '@/lib/api/client';
import type { Result } from '@/lib/result';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'USER' | 'TRAINER' | 'ADMIN';
  avatar_url?: string;
  total_points: number;
  created_at: string;
}

export const adminService = {
  /**
   * Obtiene la lista completa de usuarios para el panel de administración.
   * Llama a GET /admin/users
   */
  async getUsers(): Promise<Result<UserProfile[]>> {
    return apiClient.get<UserProfile[]>('/admin/users');
  },

  /**
   * Actualiza el rol de un usuario.
   * Llama a PATCH /admin/users/:id/role
   */
  async updateUserRole(userId: string, newRole: 'USER' | 'TRAINER' | 'ADMIN'): Promise<Result<any>> {
    return apiClient.patch(`/admin/users/${userId}/role`, { role: newRole });
  },

  /**
   * Elimina un foro y todos sus comentarios en cascada.
   * Llama a DELETE /admin/forum/:id
   */
  async deleteForum(forumId: string): Promise<Result<any>> {
    return apiClient.delete(`/admin/forum/${forumId}`);
  },

  /**
   * Elimina un comentario específico de un foro.
   * Llama a DELETE /admin/forum/comments/:id
   */
  async deleteForumComment(commentId: string): Promise<Result<any>> {
    return apiClient.delete(`/admin/forum/comments/${commentId}`);
  },
};
