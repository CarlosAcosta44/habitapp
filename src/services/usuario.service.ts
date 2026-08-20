/**
 * @file src/services/usuario.service.ts
 * @description Service Layer para la gestión del perfil de usuario y dashboard.
 * @layer Business Logic (Capa 3)
 * Todas las llamadas a datos pasan por apiClient hacia NestJS.
 */

import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import { apiClient } from "@/lib/api/client";
import type { PerfilDashboardData, ProfileForEdit, UpdateProfileDTO } from "@/types/domain/perfil.types";
import type { UserProfileDto, UpdateUserProfileDto } from "@/types/domain/usuario.types";

export class UsuarioService {
  /**
   * Obtiene el perfil completo del usuario autenticado actual.
   * Llama a: GET /users/me
   */
  async getPerfilMe(): Promise<Result<UserProfileDto>> {
    return apiClient.get<UserProfileDto>("users/me");
  }

  /**
   * Actualiza los datos del perfil del usuario autenticado actual.
   * Llama a: PATCH /users/me
   */
  async updatePerfilMe(dto: UpdateUserProfileDto): Promise<Result<UserProfileDto>> {
    return apiClient.patch<UserProfileDto>("users/me", dto);
  }

  /**
   * Obtiene y consolida toda la información necesaria para el dashboard de perfil.
   * Llama en paralelo a: /users/me/profile, /records/historial,
   * /users/me/points-history, /friends, /friends/suggestions, /users/me/achievements
   */
  async getPerfilDashboardData(): Promise<Result<PerfilDashboardData>> {
    try {
      // ─── Llamadas paralelas a la API ────────────────────────────────────────
      const [
        perfilRes,
        historialRes,
        puntosRes,
        amigosRes,
        sugerenciasRes,
        logrosRes,
      ] = await Promise.all([
        apiClient.get<any>("users/me/profile"),
        apiClient.get<any[]>("records/historial"),
        apiClient.get<any[]>("users/me/points-history?limit=5"),
        apiClient.get<any[]>("friends"),
        apiClient.get<any[]>("friends/suggestions?limit=12"),
        apiClient.get<any[]>("users/me/achievements"),
      ]);

      const perfil = perfilRes.success ? perfilRes.data : null;
      const puntos = perfil?.puntos ?? 0;
      const registrosReales = historialRes.success ? historialRes.data : [];
      const historialPuntos = puntosRes.success ? puntosRes.data : [];
      const amigos = amigosRes.success ? amigosRes.data : [];
      const sugerenciasAmigos = sugerenciasRes.success ? sugerenciasRes.data : [];
      const logros = logrosRes.success ? logrosRes.data : [];

      // ─── Estadísticas calculadas en frontend (presentación pura) ────────────
      const hoyDate = new Date();
      const mesActual = hoyDate.getMonth();
      const añoActual = hoyDate.getFullYear();

      const diasCompletadosMes = new Set(
        registrosReales
          .filter((r: any) => r.completado)
          .filter((r: any) => {
            const rowDate = new Date(r.fecha + "T12:00:00Z");
            return rowDate.getMonth() === mesActual && rowDate.getFullYear() === añoActual;
          })
          .map((r: any) => r.fecha)
      );
      const diasActivosMensuales = diasCompletadosMes.size;
      const diasEnElMes = new Date(añoActual, mesActual + 1, 0).getDate();
      const eficienciaMensual =
        diasEnElMes > 0 ? Math.round((diasActivosMensuales / diasEnElMes) * 100) : 0;

      // Racha global
      const todosLosDias = Array.from(
        new Set(registrosReales.filter((r: any) => r.completado).map((r: any) => r.fecha))
      ).sort((a, b) => (b as string).localeCompare(a as string));

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

      // Actividad reciente
      const actividad = historialPuntos.map((hp: any, idx: number) => ({
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

      const logroDestacado = logros.length > 0 ? logros[0] : null;

      // Próximo objetivo
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
      return err(`Error en UsuarioService al recopilar datos: ${msg}`);
    }
  }

  /**
   * Obtiene los datos ligeros necesarios para el formulario de edición de perfil.
   */
  async getProfileForEdit(): Promise<Result<ProfileForEdit>> {
    const result = await this.getPerfilMe();
    if (!result.success) {
      return err(`Error al obtener perfil para edición: ${result.error}`);
    }
    const data = result.data;
    return ok({
      nombre: data.nombre,
      apellido: data.apellido,
      fotoperfil: data.fotoperfil,
      telefono: data.telefono,
      genero: data.genero,
      fechanacimiento: data.fechanacimiento,
    });
  }

  /**
   * Actualiza los datos básicos del perfil.
   */
  async updateProfile(dto: UpdateProfileDTO): Promise<Result<ProfileForEdit>> {
    const updateDto: UpdateUserProfileDto = {
      nombre: dto.nombre,
      apellido: dto.apellido,
      fotoperfil: dto.fotoperfil,
      telefono: dto.telefono,
      genero: dto.genero,
      fechanacimiento: dto.fechanacimiento,
    };

    const result = await this.updatePerfilMe(updateDto);
    if (!result.success) {
      return err(`Error al actualizar perfil: ${result.error}`);
    }
    const data = result.data;
    return ok({
      nombre: data.nombre,
      apellido: data.apellido,
      fotoperfil: data.fotoperfil,
      telefono: data.telefono,
      genero: data.genero,
      fechanacimiento: data.fechanacimiento,
    });
  }

  /**
   * Sube una nueva foto de perfil vía NestJS (endpoint /users/me/avatar).
   * Usa fetch directamente porque multipart/form-data no puede pasar por apiClient.post JSON.
   */
  async updateAvatar(file: File): Promise<Result<string>> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const response = await fetch(`${API_URL}/users/me/avatar`, {
        method: "POST",
        credentials: "include", // envía las cookies HttpOnly del JWT
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Error al subir imagen";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}
        return err(errorMessage);
      }

      const responseData = await response.json();
      return ok(responseData.url);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return err(`Error inesperado en updateAvatar: ${msg}`);
    }
  }
}
