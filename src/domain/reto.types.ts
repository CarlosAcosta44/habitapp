/**
 * @file src/domain/reto.types.ts
 * @description Tipos de dominio para retos y desafíos.
 * @layer Domain (Capa 4 — Núcleo)
 */

export interface Reto {
  idreto: string;
  titulo: string;
  descripcion: string;
  insignia_recompensa?: string | null;
  puntos_recompensa?: number;
  fechainicio: string;
  fechafin?: string | null;
  estado: string;
  idusuario_creador?: string | null;
  imagen_url?: string | null;
  // Campos computados para UI
  id?: string;
  idReto?: string;
  progreso?: number;
  duracionDias?: number;
  diasRestantes?: number;
  porcentajeCompletado?: number;
  participantes?: number | string;
}
