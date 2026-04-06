/**
 * @file src/modules/reportes/reportes.repository.ts
 * @description Repositorio para el módulo de Reportes y Ranking.
 * Consultas a Supabase para estadísticas, comparativas y ranking global.
 */

import { createClient } from "@/lib/supabase/server";
import { ok, err }      from "@/lib/result";
import type { Result }  from "@/lib/result";
import type {
  EstadisticasGlobales,
  HabitoReporte,
  RankingUsuario,
} from "./types";

export class ReportesRepository {

  // ── Estadísticas globales del usuario ───────────────────────────────────────
  async findEstadisticas(userId: string): Promise<Result<EstadisticasGlobales>> {
    const supabase = await createClient();

    // Puntos totales del usuario
    const { data: usuario, error: userErr } = await supabase
      .schema("gestion")
      .from("usuarios")
      .select("puntostotales")
      .eq("idusuario", userId)
      .single();

    if (userErr) return err(`Error al obtener usuario: ${userErr.message}`);

    // Registros del usuario
    const { data: registros, error: regErr } = await supabase
      .schema("seguimiento")
      .from("registro_habitos")
      .select("completado")
      .eq("idusuario", userId);

    if (regErr) return err(`Error al obtener registros: ${regErr.message}`);

    const total = registros?.length ?? 0;
    const completados = registros?.filter((r: { completado: boolean }) => r.completado).length ?? 0;
    const fallados = total - completados;

    return ok({
      exitoPorcentaje: total > 0 ? Math.round((completados / total) * 100) : 0,
      completados,
      puntosTotales: usuario?.puntostotales ?? 0,
      rachaActual: 0,  // Se calcula en el servicio
      saltados: 0,
      fallados,
    });
  }

  // ── Ranking global ──────────────────────────────────────────────────────────
  async findRanking(userId: string): Promise<Result<RankingUsuario[]>> {
    const supabase = await createClient();

    interface RawRanking {
      posicion:      number;
      idusuario:     string;
      nombre:        string;
      apellido:      string;
      fotoperfil:    string | null;
      puntostotales: number;
    }

    const { data, error } = await supabase
      .schema("gestion")
      .from("vista_ranking")
      .select("*")
      .limit(20)
      .returns<RawRanking[]>();

    if (error) return err(`Error al obtener ranking: ${error.message}`);

    return ok(
      (data ?? []).map((row: RawRanking) => ({
        posicion:        Number(row.posicion),
        nombre:          row.nombre,
        apellido:        row.apellido,
        fotoPerfil:      row.fotoperfil,
        puntosTotales:   row.puntostotales,
        habitoPrincipal: null,
        esUsuarioActual: row.idusuario === userId,
      }))
    );
  }

  // ── Hábitos con progreso ────────────────────────────────────────────────────
  async findHabitosConProgreso(userId: string): Promise<Result<HabitoReporte[]>> {
    const supabase = await createClient();

    interface RawHabito {
      idhabito: string;
      nombre: string;
      registro_habitos: { completado: boolean }[];
    }

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("habitos")
      .select(`
        idhabito,
        nombre,
        registro_habitos!idhabito (
          completado
        )
      `)
      .eq("idusuario", userId)
      .eq("estado", "Activo")
      .limit(6)
      .returns<RawHabito[]>();

    if (error) return err(`Error al obtener hábitos: ${error.message}`);

    const colors = ["#6366f1", "#ec4899", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6"];

    return ok(
      (data ?? []).map((row: RawHabito, i: number) => {
        const total = row.registro_habitos?.length ?? 0;
        const completados = row.registro_habitos?.filter((r: { completado: boolean }) => r.completado).length ?? 0;
        const progreso = total > 0 ? Math.round((completados / total) * 100) : 0;

        return {
          idHabito: row.idhabito,
          nombre: row.nombre,
          porcentajeCambio: progreso > 50 ? `+${progreso - 50}%` : "Estable",
          descripcion: `${completados} de ${total} registros completados`,
          progreso,
          color: colors[i % colors.length],
        };
      })
    );
  }
}
