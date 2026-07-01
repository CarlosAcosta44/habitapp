/**
 * @file src/services/usuario.service.ts
 * @description Service Layer para la gestión del perfil de usuario y dashboard.
 * @layer Business Logic (Capa 3)
 */

import { ok, err } from "@/lib/result";
import type { Result } from "@/lib/result";
import { apiClient } from "@/lib/api/client";
import { createClient } from "@/lib/supabase/server";
import { PerfilRepository } from "@/repositories/perfil.repository";
import { AmigosRepository } from "@/repositories/amigos.repository";
import { RegistroRepository } from "@/repositories/registro.repository";
import type { PerfilDashboardData, ProfileForEdit, UpdateProfileDTO } from "@/types/domain/perfil.types";
import type { UserProfileDto, UpdateUserProfileDto } from "@/types/domain/usuario.types";

export class UsuarioService {
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
      return err(`Error en UsuarioService al recopilar datos: ${msg}`);
    }
  }

  /**
   * Obtiene los datos ligeros necesarios para el formulario de edición de perfil.
   * Llama a: GET /users/me en el backend de NestJS.
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
   * Actualiza los datos básicos del perfil (nombre, apellido, fotoperfil).
   * Canaliza la mutación a través de la API en NestJS.
   */
  async updateProfile(dto: UpdateProfileDTO): Promise<Result<ProfileForEdit>> {
    // Transform UpdateProfileDTO to UpdateUserProfileDto
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
   * Sube una nueva foto de perfil al bucket 'avatars' de Supabase
   * y luego actualiza el registro llamando a updateProfile.
   * @param userId El ID del usuario autenticado.
   * @param file El archivo a subir (File object).
   */
  async updateAvatar(userId: string, file: File): Promise<Result<string>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Using raw fetch instead of apiClient.post because apiClient stringifies bodies.
      // This assumes we fetch the token in a similar way as apiClient.
      const supabase = await createClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token || null;
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const response = await fetch(`${API_URL}/users/me/avatar`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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
