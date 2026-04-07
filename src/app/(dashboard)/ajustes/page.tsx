/**
 * @file src/app/(dashboard)/ajustes/page.tsx
 * @description Página de Ajustes / Configuración.
 * Secciones General y Más opciones con toggles y enlaces.
 */

import { AjustesClient } from "./AjustesClient";

export const metadata = { title: "Ajustes | HabitApp" };

export default function AjustesPage() {
  return <AjustesClient />;
}
