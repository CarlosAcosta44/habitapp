/**
 * @file src/lib/result.ts
 * @description Patrón Result<T> para manejo seguro de errores.
 * Elimina el uso de try/catch en los repositorios y servicios.
 * Cada operación retorna éxito o fracaso de forma explícita.
 */

export type Result<T> =
  | { success: true;  data: T }
  | { success: false; error: string };

export const ok = <T>(data: T): Result<T> => ({
  success: true,
  data,
});

export const err = (error: string): Result<never> => ({
  success: false,
  error,
});