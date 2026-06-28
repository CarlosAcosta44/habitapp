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
   * Llama a GET /users
   */
  async getUsers(): Promise<Result<UserProfile[]>> {
    return apiClient.get<UserProfile[]>('/users');
  },

  /**
   * Actualiza el rol de un usuario.
   * Llama a PATCH /users/:id/role
   */
  async updateUserRole(userId: string, newRole: 'USER' | 'TRAINER' | 'ADMIN'): Promise<Result<any>> {
    return apiClient.patch(`/users/${userId}/role`, { role: newRole });
  },
};
