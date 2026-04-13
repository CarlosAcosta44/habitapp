/**
 * @file src/modules/registros/registro.repository.ts
 * @description Repositorio para seguimiento.registro_habitos.
 * Maneja el progreso diario y el cálculo de rachas.
 *
 * @pattern Repository Pattern
 * @principle SRP — solo acceso a datos de registros
 * @note El trigger sumar_puntos_habito en BD suma puntos automáticamente
 *       al marcar completado=true. No necesitamos hacerlo aquí.
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
} from "./types";

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
  /**
   * Trae todos los registros de un hábito ordenados por fecha.
   * Útil para mostrar el historial y calcular rachas en el cliente.
   */
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
  /**
   * Trae todos los registros de un usuario con datos del hábito (JOIN).
   * Útil para el historial general del usuario.
   */
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
  /**
   * Trae el registro de HOY para un hábito específico.
   * Retorna null si todavía no existe.
   */
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
  /**
   * ⭐ Operación compuesta: crea o actualiza el registro del día como completado.
   *
   * FLUJO:
   * 1. Busca si ya existe un registro para hoy (upsert por constraint único)
   * 2. Lo inserta/actualiza con completado = true
   * 3. El TRIGGER sumar_puntos_habito en BD suma los puntos automáticamente
   *    y guarda el historial. No necesitamos hacerlo aquí.
   */
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
        {
          // El constraint UNIQUE (idhabito, idusuario, fecha) maneja el conflicto
          onConflict: "idhabito,idusuario,fecha",
        }
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

    // 1. Obtener registro de hoy primero
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
    const isAlreadyCompleted = hoyReg?.completado ?? false;

    // Si ya estaba completado, evitamos avanzar más? (Figma implies no over-tracking limits, let's max it at metaDiaria just in case)
    const newProgress = Math.min(dto.metaDiaria, currentProgress + dto.cantidadAsumar);
    const completadoFinal = newProgress >= dto.metaDiaria;

    // 2. Upsert con el nuevo progreso
    const { data: resultInsert, error: errInsert } = await supabase
      .schema("seguimiento")
      .from("registro_habitos")
      .upsert(
        {
          idhabito:   dto.idHabito,
          idusuario:  dto.idUsuario,
          fecha:      dto.fecha,
          completado: completadoFinal,
          progreso_actual: newProgress,
          observacion: dto.observacion ?? null,
        },
        {
          onConflict: "idhabito,idusuario,fecha",
        }
      )
      .select("*")
      .returns<RawRegistro>()
      .single();

    if (errInsert) return err(`Error actualizando progreso: ${errInsert.message}`);
    
    return ok(this.mapToDomain(resultInsert as RawRegistro));
  }

  // ─── desmarcarCompletado ──────────────────────────────────────────────────
  /**
   * Desmarca un hábito como completado (por si el usuario se equivocó).
   * Solo funciona en el día actual.
   */
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
  /**
   * ⭐ Calcula la racha actual y máxima de un hábito.
   *
   * LÓGICA:
   * - Trae todos los registros completados ordenados por fecha DESC
   * - Racha actual: cuenta días consecutivos desde hoy hacia atrás
   * - Racha máxima: la racha más larga encontrada en el historial
   */
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
      return ok({
        idHabito:         habitoId,
        rachaActual:      0,
        rachaMáxima:      0,
        totalCompletados: 0,
      });
    }

    // ── Calcular racha actual ──────────────────────────────────────────────
    let rachaActual = 0;
    const hoy = new Date();

    for (let i = 0; i < registros.length; i++) {
      const fechaEsperada = new Date(hoy);
      fechaEsperada.setDate(hoy.getDate() - i);
      const fechaEsperadaStr = fechaEsperada.toISOString().split("T")[0];

      if (registros[i].fecha === fechaEsperadaStr) {
        rachaActual++;
      } else {
        break; // Se rompió la consecutividad
      }
    }

    // ── Calcular racha máxima ──────────────────────────────────────────────
    let rachaMáxima   = 0;
    let rachaTemp     = 1;

    // Ordenar ascendente para comparar días consecutivos
    const fechasAsc = [...registros]
      .map((r) => r.fecha)
      .sort((a, b) => a.localeCompare(b));

    for (let i = 1; i < fechasAsc.length; i++) {
      const prev = new Date(fechasAsc[i - 1]);
      const curr = new Date(fechasAsc[i]);
      const diffDias = Math.round(
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDias === 1) {
        rachaTemp++;
        rachaMáxima = Math.max(rachaMáxima, rachaTemp);
      } else {
        rachaTemp = 1;
      }
    }
    rachaMáxima = Math.max(rachaMáxima, rachaTemp);

    return ok({
      idHabito: habitoId,
      rachaActual,
      rachaMáxima,
      totalCompletados,
    });
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