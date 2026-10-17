/**
 * @file src/types/domain/habito.types.ts
 * @description Tipos de dominio para el módulo de Hábitos.
 * Mapea columnas PostgreSQL (snake_case) a propiedades TypeScript (camelCase).
 */

// ─── Categoría ────────────────────────────────────────────────────────────────
export interface CategoriaHabito {
  idCategoria: string;
  nombre:      string;
  descripcion: string | null;
}

// ─── Hábito base ──────────────────────────────────────────────────────────────
export interface Habito {
  idHabito:    string;
  nombre:      string;
  descripcion: string | null;
  fechaInicio: string;
  fechaFin:    string | null;
  estado:      "Activo" | "Inactivo" | "Completado";
  puntos:      number;
  metaDiaria:  number;
  unidadMedida:string;
  idUsuario:   string;
  idCategoria: string;
}

// ─── Hábito con categoría (JOIN) ──────────────────────────────────────────────
export interface HabitoConCategoria extends Habito {
  categoria: CategoriaHabito;
}

// ─── Hábito con progreso del día (JOIN anidado) ───────────────────────────────
export interface HabitoConProgreso extends HabitoConCategoria {
  registroHoy: {
    idRegistro:    string;
    completado:    boolean;
    progresoActual:number;
    puntosGanados: number;
    observacion:   string | null;
  } | null;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export type CreateHabitoDTO = Omit<Habito, "idHabito">;
export type UpdateHabitoDTO = Partial<Omit<Habito, "idHabito" | "idUsuario">>;

export interface HabitoFilters {
  estado?:      Habito["estado"];
  idCategoria?: string;
}
