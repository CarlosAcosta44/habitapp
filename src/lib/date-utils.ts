/**
 * @file src/lib/date-utils.ts
 * @description Utilidades de fechas que respetan la zona horaria local del usuario.
 * Evita el desfase de UTC que genera toISOString() en horarios vespertinos/nocturnos.
 */

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
