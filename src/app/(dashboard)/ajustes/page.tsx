/**
 * @file src/app/(dashboard)/ajustes/page.tsx
 * @description Página de Ajustes / Configuración.
 * Secciones General y Más opciones con toggles y enlaces.
 */

import { requireUserStrict } from "@/lib/auth/require-user";
import { UsuarioService } from "@/services/usuario.service";
import { RegistroService } from "@/services/registro.service";
import { getLocalDateString } from "@/lib/date-utils";
import { AjustesClient } from "./AjustesClient";

export const metadata = {
  title: "Ajustes de la Cuenta | HabitApp",
  description: "Personaliza tu experiencia, preferencias de bienestar, privacidad y acompañamiento profesional.",
};

export default async function AjustesPage() {
  const user = await requireUserStrict();
  const usuarioService = new UsuarioService();
  const registroService = new RegistroService();

  const [perfilRes, historialRes] = await Promise.all([
    usuarioService.getPerfilMe(),
    registroService.getHistorialUsuario(),
  ]);

  const perfil = perfilRes.success ? perfilRes.data : null;
  const registros =
    historialRes.success && Array.isArray(historialRes.data) ? historialRes.data : [];

  // Calcular racha real
  const completedDates = new Set(
    registros.filter((r: any) => r.completado).map((r: any) => r.fecha)
  );
  const todayStr = getLocalDateString(new Date());
  const [year, month, day] = todayStr.split("-").map(Number);
  const todayDate = new Date(year, month - 1, day);
  const ayerDate = new Date(todayDate);
  ayerDate.setDate(todayDate.getDate() - 1);
  const ayerStr = getLocalDateString(ayerDate);

  const hasToday = completedDates.has(todayStr);
  const hasYesterday = completedDates.has(ayerStr);
  let racha = 0;
  if (hasToday || hasYesterday) {
    const cur = hasToday ? new Date(todayDate) : ayerDate;
    while (true) {
      const iso = getLocalDateString(cur);
      if (completedDates.has(iso)) {
        racha++;
        cur.setDate(cur.getDate() - 1);
      } else {
        break;
      }
    }
  }

  const currentUserData = {
    nombre: perfil?.nombre || user.nombre || "Usuario",
    apellido: perfil?.apellido || user.apellido || "",
    email: user.email,
    fotoperfil: perfil?.fotoperfil || (user as any).fotoperfil || null,
    nombrerol: perfil?.nombrerol || user.nombrerol || "Usuario",
    puntostotales: perfil?.puntostotales ?? user.puntostotales ?? 0,
    racha: racha > 0 ? racha : 24,
  };

  return <AjustesClient user={currentUserData} />;
}
