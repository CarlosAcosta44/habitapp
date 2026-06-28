import { apiClient } from '@/lib/api/client';
import type { Result } from '@/lib/result';

export interface CoachClient {
  assigned_at: string;
  client: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    total_points: number;
  };
}

export interface RoutineHabit {
  id: string;
  habit_name: string;
  habit_icon: string;
  frequency: string;
  order_index: number;
}

export interface CoachRoutine {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  routine_habits: RoutineHabit[];
}

export interface CreateRoutineDto {
  name: string;
  description?: string;
  habits?: {
    habit_name: string;
    habit_icon?: string;
    frequency?: string;
  }[];
}

export interface ClientProgress {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  habits: any[]; // Resumen de los hábitos del cliente
}

export const coachService = {
  async getClients(): Promise<Result<CoachClient[]>> {
    return apiClient.get<CoachClient[]>('/coach/clients');
  },

  async getRoutines(): Promise<Result<CoachRoutine[]>> {
    return apiClient.get<CoachRoutine[]>('/coach/routines');
  },

  async createRoutine(dto: CreateRoutineDto): Promise<Result<CoachRoutine>> {
    return apiClient.post<CoachRoutine>('/coach/routines', dto);
  },

  async assignRoutine(clientId: string, routineId: string): Promise<Result<any>> {
    return apiClient.post(`/coach/clients/${clientId}/routines/${routineId}/assign`);
  },

  async getClientProgress(clientId: string): Promise<Result<ClientProgress>> {
    return apiClient.get<ClientProgress>(`/coach/clients/${clientId}/progress`);
  },
};
