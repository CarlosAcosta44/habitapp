import { coachRepository } from "@/repositories/coach.repository";
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

/** Alias compatible con el tipo que usaba modules/entrenador/types.ts */
export interface RutinaConUsuarios {
  idRutina: string;
  tipo: string;
  descripcion: string | null;
  duracion: number | null;
  objetivo: string | null;
  nivel: 'Principiante' | 'Intermedio' | 'Avanzado';
  idEntrenador: string;
  usuariosAsignados: {
    idUsuario: string;
    nombre: string;
    apellido: string;
    fechaInicio: string;
    estado: string;
  }[];
}

export interface UpdateRoutineDto {
  name?: string;
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
    return coachRepository.get<CoachClient[]>('/coach/clients');
  },

  async getRoutines(): Promise<Result<CoachRoutine[]>> {
    return coachRepository.get<CoachRoutine[]>('/coach/routines');
  },

  async createRoutine(dto: CreateRoutineDto): Promise<Result<CoachRoutine>> {
    return coachRepository.post<CoachRoutine>('/coach/routines', dto);
  },

  async getRoutineById(id: string): Promise<Result<CoachRoutine>> {
    return coachRepository.get<CoachRoutine>(`/coach/routines/${id}`);
  },

  async updateRoutine(id: string, dto: UpdateRoutineDto): Promise<Result<CoachRoutine>> {
    return coachRepository.patch<CoachRoutine>(`/coach/routines/${id}`, dto);
  },

  async deleteRoutine(id: string): Promise<Result<any>> {
    return coachRepository.delete(`/coach/routines/${id}`);
  },

  async assignRoutine(clientId: string, routineId: string): Promise<Result<any>> {
    return coachRepository.post(`/coach/clients/${clientId}/routines/${routineId}/assign`);
  },

  async getClientProgress(clientId: string): Promise<Result<ClientProgress>> {
    return coachRepository.get<ClientProgress>(`/coach/clients/${clientId}/progress`);
  },
};
