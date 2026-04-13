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

export interface ComparativaGraphed {
  diasSemana: string[];
  data: {
    categoriaId: string;
    vals: number[]; // Puntos en el gráfico del 0 a 100
  }[];
}

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

  // ── Comparativa Semanal (Gráfico) ───────────────────────────────────────────
  async findComparativaSemanal(userId: string): Promise<Result<ComparativaGraphed>> {
    const supabase = await createClient();

    // Obtener registros de los últimos 7 días con su categoría
    const { data: registros, error } = await supabase
      .schema("seguimiento")
      .from("registro_habitos")
      .select(`
        fecha, 
        completado,
        habitos!idhabito (
          idcategoria,
          categorias_habitos!fk_habitos_categoria (
            nombre
          )
        )
      `)
      .eq("idusuario", userId)
      .gte("fecha", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order("fecha", { ascending: true });

    if (error) return err(`Error al obtener comparativa: ${error.message}`);

    // Fechas de los últimos 7 días
    const hoy = new Date();
    const ultimos7Dias: string[] = [];
    const diasSemanaNombres = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
    const arrayNombres: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      ultimos7Dias.push(iso);
      arrayNombres.push(diasSemanaNombres[d.getDay()]);
    }

    // Inicializar contadores por categoría
    // Buscaremos específicamente "Salud" y "Enfoque" (o similares)
    const dataSalud = [0,0,0,0,0,0,0];
    const dataEnfoque = [0,0,0,0,0,0,0];

    registros?.forEach((r: any) => {
      const dayIdx = ultimos7Dias.indexOf(r.fecha);
      if (dayIdx >= 0 && r.completado) {
        const catNombre = r.habitos?.categorias_habitos?.nombre?.toLowerCase() || "";
        
        if (catNombre.includes("salud") || catNombre.includes("nutrición") || catNombre.includes("bienestar")) {
           dataSalud[dayIdx] = Math.min(100, dataSalud[dayIdx] + 20); // Cada check suma 20%
        } else {
           // Si no es salud, lo promediamos en enfoque/productividad
           dataEnfoque[dayIdx] = Math.min(100, dataEnfoque[dayIdx] + 25);
        }
      }
    });

    return ok({
       diasSemana: arrayNombres,
       data: [
         { categoriaId: "SALUD", vals: dataSalud },
         { categoriaId: "ENFOQUE", vals: dataEnfoque }
       ]
    });
  }
}
