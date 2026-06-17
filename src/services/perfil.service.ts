/**
 * @file src/services/perfil.service.ts
 * @description Capa de servicios para la lógica del perfil del usuario (racha global, hito, estadísticas).
 * @layer Business Logic (Capa 3)
 */

import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import { PerfilRepository } from "@/repositories/perfil.repository";
import { AmigosRepository } from "@/repositories/amigos.repository";
import { RegistroRepository } from "@/repositories/registro.repository";
import type { PerfilDashboardData } from "@/types/domain/perfil.types";

export class PerfilService {
  private readonly perfilRepo: PerfilRepository;
  private readonly amigosRepo: AmigosRepository;
  private readonly registroRepo: RegistroRepository;

  constructor(
    perfilRepo?: PerfilRepository,
    amigosRepo?: AmigosRepository,
    registroRepo?: RegistroRepository
  ) {
    this.perfilRepo = perfilRepo ?? new PerfilRepository();
    this.amigosRepo = amigosRepo ?? new AmigosRepository();
    this.registroRepo = registroRepo ?? new RegistroRepository();
  }

  /**
   * Obtiene y consolida toda la información necesaria para el dashboard de perfil.
   */
  async getPerfilDashboardData(userId: string): Promise<Result<PerfilDashboardData>> {
    try {
      // 1. Obtener datos básicos de perfil
      const perfilResult = await this.perfilRepo.getPerfil(userId);
      if (!perfilResult.success) {
        return err(perfilResult.error);
      }
      const perfil = perfilResult.data;

      const puntos = perfil?.puntos ?? 0;

      // 2. Obtener historial de registros para cálculo de estadísticas
      const historialResult = await this.registroRepo.findByUsuarioId(userId);
      const registrosReales = historialResult.success ? historialResult.data : [];

      // Calcular días activos del mes
      const hoyDate = new Date();
      const mesActual = hoyDate.getMonth();
      const añoActual = hoyDate.getFullYear();

      const diasCompletadosMes = new Set(
        registrosReales
          .filter((r) => r.completado)
          .filter((r) => {
            const rowDate = new Date(r.fecha + "T12:00:00Z"); // Fix TZ boundary
            return rowDate.getMonth() === mesActual && rowDate.getFullYear() === añoActual;
          })
          .map((r) => r.fecha)
      );
      const diasActivosMensuales = diasCompletadosMes.size;
      const diasEnElMes = new Date(añoActual, mesActual + 1, 0).getDate();
      const eficienciaMensual = diasEnElMes > 0 
        ? Math.round((diasActivosMensuales / diasEnElMes) * 100)
        : 0;

      // Calcular Racha Global (Días consecutivos con al menos un hábito completado)
      const todosLosDias = Array.from(
        new Set(registrosReales.filter((r) => r.completado).map((r) => r.fecha))
      ).sort((a, b) => b.localeCompare(a));

      let rachaGlobal = 0;
      for (let i = 0; i < todosLosDias.length; i++) {
        const d = new Date(hoyDate);
        d.setDate(hoyDate.getDate() - i);
        const expected = d.toISOString().split("T")[0];
        if (todosLosDias[i] === expected) {
          rachaGlobal++;
        } else {
          break;
        }
      }

      // 3. Actividad de Puntos
      const actividadResult = await this.perfilRepo.getPointsHistory(userId, 5);
      const historialPuntos = actividadResult.success ? actividadResult.data : [];

      const actividad = historialPuntos.map((hp, idx) => ({
        id: hp.idhistorial,
        tipo: idx % 2 === 0 ? "habito" : "logro",
        titulo: hp.motivo,
        desc: `Puntos obtenidos el ${hp.fecha}`,
        puntos: hp.puntos,
        label: "PUNTOS",
        icono: "⭐",
        color: "border-l-indigo-500 bg-indigo-600/5",
        extra: null,
      }));

      if (actividad.length === 0) {
        actividad.push({
          id: "mock",
          tipo: "info",
          titulo: "¡Bienvenido a HabitApp!",
          desc: "Comienza a completar hábitos para ver tu progreso aquí.",
          puntos: 0,
          label: "",
          icono: "👋",
          color: "border-l-slate-500 bg-slate-600/5",
          extra: null,
        });
      }

      // 4. Amigos
      const amigosResult = await this.amigosRepo.getAcceptedFriends(userId);
      const amigos = amigosResult.success ? amigosResult.data : [];

      // 5. Sugerencias de amigos
      const sugerenciasResult = await this.amigosRepo.getFriendSuggestions(userId, 12);
      const sugerenciasAmigos = sugerenciasResult.success ? sugerenciasResult.data : [];

      // 6. Logros
      const logrosResult = await this.perfilRepo.getUserAchievements(userId);
      const logros = logrosResult.success ? logrosResult.data : [];
      const logroDestacado = logros.length > 0 ? logros[0] : null;

      // 7. Lógica de Próximo Objetivo
      let proximoObjetivo = { nombre: "Inicia tu camino", desc: "Consigue tus primeros puntos.", meta: 100, actual: puntos };
      if (puntos < 100) {
        proximoObjetivo = { nombre: "Aspirante", desc: "Consigue tus primeros 100 puntos", meta: 100, actual: puntos };
      } else if (puntos < 500) {
        proximoObjetivo = { nombre: "Aplicado", desc: "Tu meta ahora son 500 puntos", meta: 500, actual: puntos };
      } else if (puntos < 1500) {
        proximoObjetivo = { nombre: "Constante", desc: "Alcanzar 1500 puntos es el reto", meta: 1500, actual: puntos };
      } else {
        proximoObjetivo = { nombre: "Mente de Acero", desc: "Llega a la increíble suma de 5000 puntos", meta: 5000, actual: puntos };
      }

      const porcentajeObj = Math.min(100, Math.round((proximoObjetivo.actual / proximoObjetivo.meta) * 100));

      return ok({
        perfil,
        rachaGlobal,
        diasActivosMensuales,
        eficienciaMensual,
        diasEnElMes,
        actividad,
        amigos,
        sugerenciasAmigos,
        logros,
        logroDestacado,
        proximoObjetivo,
        porcentajeObj,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return err(`Error en PerfilService al recopilar datos: ${msg}`);
    }
  }
}
