/**
 * @file src/types/domain/entrenador.types.ts
 * @description Tipos de dominio para el módulo de Entrenadores.
 */

// ─── Entrenador base ──────────────────────────────────────────────────────────
export interface Entrenador {
  idEntrenador:  string;
  especialidad:  string | null;
  certificacion: string | null;
  experiencia:   number | null;
  idUsuario:     string;
}

// ─── Entrenador con datos del usuario (JOIN) ──────────────────────────────────
export interface EntrenadorConPerfil extends Entrenador {
  usuario: {
    nombre:      string;
    apellido:    string;
    fotoPerfil:  string | null;
    telefono:    string | null;
  };
}

// ─── Rutina ───────────────────────────────────────────────────────────────────
export interface Rutina {
  idRutina:     string;
  tipo:         string;
  descripcion:  string | null;
  duracion:     number | null;
  objetivo:     string | null;
  nivel:        "Principiante" | "Intermedio" | "Avanzado";
  idEntrenador: string;
}

// ─── Rutina con usuarios asignados (JOIN) ─────────────────────────────────────
export interface RutinaConUsuarios extends Rutina {
  usuariosAsignados: {
    idUsuario:   string;
    nombre:      string;
    apellido:    string;
    fechaInicio: string;
    estado:      string;
  }[];
}

// ─── Seguimiento ──────────────────────────────────────────────────────────────
export interface Seguimiento {
  idSeguimiento: string;
  fecha:         string;
  progreso:      string | null;
  observaciones: string | null;
  idEntrenador:  string;
  idUsuario:     string;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export type CreateRutinaDTO    = Omit<Rutina,       "idRutina">;
export type CreateSeguimientoDTO = Omit<Seguimiento, "idSeguimiento">;
export type AsignarRutinaDTO   = {
  idUsuario:   string;
  idRutina:    string;
  fechaInicio: string;
};
