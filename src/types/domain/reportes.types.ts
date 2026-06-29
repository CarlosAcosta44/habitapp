/**
 * @file src/types/domain/reportes.types.ts
 * @description Tipos de dominio para el módulo de Reportes y Ranking.
 */

// ── Estadísticas globales del usuario ─────────────────────────────────────────
export interface EstadisticasGlobales {
  exitoPorcentaje: number;
  completados:     number;
  puntosTotales:   number;
  rachaActual:     number;
  saltados:        number;
  fallados:        number;
}

// ── Hábito individual con reporte ─────────────────────────────────────────────
export interface HabitoReporte {
  idHabito:         string;
  nombre:           string;
  porcentajeCambio: string;
  descripcion:      string;
  progreso:         number;   // 0–100
  color:            string;
}

// ── Datos comparativa semanal ─────────────────────────────────────────────────
export interface ComparativaSemanal {
  dia:    string;
  salud:  number;
  enfoque: number;
}

// ── Usuario en ranking ────────────────────────────────────────────────────────
export interface RankingUsuario {
  posicion:        number;
  nombre:          string;
  apellido:        string;
  fotoPerfil:      string | null;
  puntosTotales:   number;
  habitoPrincipal: string | null;
  esUsuarioActual: boolean;
}

// ── Periodo de reporte ────────────────────────────────────────────────────────
export type PeriodoReporte = "Diario" | "Semanal" | "Mensual";
