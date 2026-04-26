/**
 * @file src/types/domain/registro.types.ts
 * @description Tipos de dominio para registros diarios de hábitos y rachas.
 */

// ─── Registro diario ──────────────────────────────────────────────────────────
export interface RegistroHabito {
  idRegistro:    string;
  fecha:         string;       // "YYYY-MM-DD"
  completado:    boolean;
  progresoActual:number;
  puntosGanados: number;
  observacion:   string | null;
  idHabito:      string;
  idUsuario:     string;
}

// ─── Registro con datos del hábito (JOIN) ─────────────────────────────────────
export interface RegistroConHabito extends RegistroHabito {
  habito: {
    nombre:      string;
    puntos:      number;
    idCategoria: string;
  };
}

// ─── Resultado del cálculo de racha ───────────────────────────────────────────
export interface RachaActual {
  idHabito:        string;
  rachaActual:     number;   // días consecutivos hasta hoy
  rachaMáxima:     number;   // racha más larga histórica
  totalCompletados: number;  // total de días completados
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export type CreateRegistroDTO = Omit<RegistroHabito, "idRegistro" | "puntosGanados">;
export type MarcarCompletadoDTO = {
  idHabito:   string;
  idUsuario:  string;
  fecha:      string;
  observacion?: string;
};

export type AvanzarProgresoDTO = {
  idHabito:   string;
  idUsuario:  string;
  fecha:      string;
  cantidadAsumar: number;
  metaDiaria: number;
  observacion?: string;
};
