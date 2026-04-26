/**
 * @file src/repositories/registro.repository.ts
 * @description Repositorio para seguimiento.registro_habitos.
 * @layer Data & Infrastructure (Capa 4)
 * @pattern Repository Pattern
 * @principle SRP — solo acceso a datos de registros
 */

import { createClient } from "@/lib/supabase/server";
import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import type {
  RegistroHabito,
  RegistroConHabito,
  RachaActual,
  CreateRegistroDTO,
  MarcarCompletadoDTO,
  AvanzarProgresoDTO,
} from "@/types/domain/registro.types";

// ─── Tipos crudos de Supabase ─────────────────────────────────────────────────
interface RawRegistro {
  idregistro:    string;
  fecha:         string;
  completado:    boolean;
  progreso_actual: number;
  puntos_ganados: number;
  observacion:   string | null;
  idhabito:      string;
  idusuario:     string;
}

interface RawRegistroConHabito extends RawRegistro {
  habitos: {
    nombre:      string;
    puntos:      number;
    idcategoria: string;
  } | null;
}

export class RegistroRepository {

  // ─── findByHabitoId ────────────────────────────────────────────────────────
  async findByHabitoId(
    habitoId: string
  ): Promise<Result<RegistroHabito[]>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("registro_habitos")
      .select("*")
      .eq("idhabito", habitoId)
      .order("fecha", { ascending: false })
      .returns<RawRegistro[]>();

    if (error) return err(`Error al obtener registros: ${error.message}`);
    return ok((data ?? []).map(this.mapToDomain));
  }

  // ─── findByUsuarioId ───────────────────────────────────────────────────────
  async findByUsuarioId(
    usuarioId: string
  ): Promise<Result<RegistroConHabito[]>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("registro_habitos")
      .select(`
        idregistro,
        fecha,
        completado,
        puntos_ganados,
        observacion,
        idhabito,
        idusuario,
        habitos (
          nombre,
          puntos,
          idcategoria
        )
      `)
      .eq("idusuario", usuarioId)
      .order("fecha", { ascending: false })
      .returns<RawRegistroConHabito[]>();

    if (error) return err(`Error al obtener registros del usuario: ${error.message}`);

    return ok(
      (data ?? []).map((row: RawRegistroConHabito) => ({
        ...this.mapToDomain(row),
        habito: {
          nombre:      row.habitos?.nombre      ?? "",
          puntos:      row.habitos?.puntos       ?? 0,
          idCategoria: row.habitos?.idcategoria  ?? "",
        },
      }))
    );
  }

  // ─── findHoy ──────────────────────────────────────────────────────────────
  async findHoy(
    habitoId: string,
    usuarioId: string
  ): Promise<Result<RegistroHabito | null>> {
    const supabase = await createClient();
    const hoy = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("registro_habitos")
      .select("*")
      .eq("idhabito",  habitoId)
      .eq("idusuario", usuarioId)
      .eq("fecha",     hoy)
      .returns<RawRegistro>()
      .single();

    if (error && error.code !== "PGRST116") {
      return err(`Error al buscar registro de hoy: ${error.message}`);
    }
    if (!data) return ok(null);

    return ok(this.mapToDomain(data as RawRegistro));
  }

  // ─── marcarCompletado ─────────────────────────────────────────────────────
  async marcarCompletado(
    dto: MarcarCompletadoDTO
  ): Promise<Result<RegistroHabito>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("registro_habitos")
      .upsert(
        {
          idhabito:   dto.idHabito,
          idusuario:  dto.idUsuario,
          fecha:      dto.fecha,
          completado: true,
          observacion: dto.observacion ?? null,
        },
        { onConflict: "idhabito,idusuario,fecha" }
      )
      .select("*")
      .returns<RawRegistro>()
      .single();

    if (error) return err(`Error al marcar hábito como completado: ${error.message}`);
    return ok(this.mapToDomain(data as RawRegistro));
  }

  // ─── avanzarProgreso ──────────────────────────────────────────────────────
  async avanzarProgreso(
    dto: AvanzarProgresoDTO
  ): Promise<Result<RegistroHabito>> {
    const supabase = await createClient();

    const { data: hoyReg, error: eqErr } = await supabase
      .schema("seguimiento")
      .from("registro_habitos")
      .select("progreso_actual, completado")
      .eq("idhabito", dto.idHabito)
      .eq("idusuario", dto.idUsuario)
      .eq("fecha", dto.fecha)
      .maybeSingle();

    if (eqErr && eqErr.code !== 'PGRST116') {
      return err(`Error buscando progreso diario: ${eqErr.message}`);
    }

    const currentProgress = hoyReg?.progreso_actual ?? 0;
    const newProgress = Math.min(dto.metaDiaria, currentProgress + dto.cantidadAsumar);
    const completadoFinal = newProgress >= dto.metaDiaria;

    const { data: resultInsert, error: errInsert } = await supabase
      .schema("seguimiento")
      .from("registro_habitos")
      .upsert(
        {
          idhabito:        dto.idHabito,
          idusuario:       dto.idUsuario,
          fecha:           dto.fecha,
          completado:      completadoFinal,
          progreso_actual: newProgress,
          observacion:     dto.observacion ?? null,
        },
        { onConflict: "idhabito,idusuario,fecha" }
      )
      .select("*")
      .returns<RawRegistro>()
      .single();

    if (errInsert) return err(`Error actualizando progreso: ${errInsert.message}`);
    return ok(this.mapToDomain(resultInsert as RawRegistro));
  }

  // ─── desmarcarCompletado ──────────────────────────────────────────────────
  async desmarcarCompletado(
    habitoId: string,
    usuarioId: string
  ): Promise<Result<RegistroHabito>> {
    const supabase = await createClient();
    const hoy = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("registro_habitos")
      .update({ completado: false })
      .eq("idhabito",  habitoId)
      .eq("idusuario", usuarioId)
      .eq("fecha",     hoy)
      .select("*")
      .returns<RawRegistro>()
      .single();

    if (error) return err(`Error al desmarcar hábito: ${error.message}`);
    return ok(this.mapToDomain(data as RawRegistro));
  }

  // ─── calcularRacha ────────────────────────────────────────────────────────
  async calcularRacha(
    habitoId: string,
    usuarioId: string
  ): Promise<Result<RachaActual>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("seguimiento")
      .from("registro_habitos")
      .select("fecha, completado")
      .eq("idhabito",   habitoId)
      .eq("idusuario",  usuarioId)
      .eq("completado", true)
      .order("fecha", { ascending: false })
      .returns<{ fecha: string; completado: boolean }[]>();

    if (error) return err(`Error al calcular racha: ${error.message}`);

    const registros = data ?? [];
    const totalCompletados = registros.length;

    if (totalCompletados === 0) {
      return ok({ idHabito: habitoId, rachaActual: 0, rachaMáxima: 0, totalCompletados: 0 });
    }

    let rachaActual = 0;
    const hoy = new Date();
    for (let i = 0; i < registros.length; i++) {
      const fechaEsperada = new Date(hoy);
      fechaEsperada.setDate(hoy.getDate() - i);
      if (registros[i].fecha === fechaEsperada.toISOString().split("T")[0]) {
        rachaActual++;
      } else {
        break;
      }
    }

    let rachaMáxima = 0;
    let rachaTemp   = 1;
    const fechasAsc = [...registros].map((r) => r.fecha).sort((a, b) => a.localeCompare(b));
    for (let i = 1; i < fechasAsc.length; i++) {
      const diffDias = Math.round(
        (new Date(fechasAsc[i]).getTime() - new Date(fechasAsc[i - 1]).getTime()) / 86400000
      );
      if (diffDias === 1) {
        rachaTemp++;
        rachaMáxima = Math.max(rachaMáxima, rachaTemp);
      } else {
        rachaTemp = 1;
      }
    }
    rachaMáxima = Math.max(rachaMáxima, rachaTemp);

    return ok({ idHabito: habitoId, rachaActual, rachaMáxima, totalCompletados });
  }

  // ─── mapToDomain ──────────────────────────────────────────────────────────
  private mapToDomain(row: RawRegistro): RegistroHabito {
    return {
      idRegistro:    row.idregistro,
      fecha:         row.fecha,
      completado:    row.completado,
      progresoActual: row.progreso_actual,
      puntosGanados: row.puntos_ganados,
      observacion:   row.observacion,
      idHabito:      row.idhabito,
      idUsuario:     row.idusuario,
    };
  }
}
