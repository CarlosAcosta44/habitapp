/**
 * @file src/types/domain/perfil.types.ts
 * @description Tipos de datos para el dominio de Perfil y Dashboard del usuario.
 */

export interface ActividadItem {
  id: string;
  tipo: string; // 'habito' | 'logro' | 'info' | 'racha_rota'
  titulo: string;
  desc: string;
  puntos: number;
  label: string;
  icono: string;
  color: string;
  extra: string | null;
}

export interface AmigoReal {
  id: string;
  nombre: string | null;
  apellido: string | null;
  puntos: number | null;
  top: boolean;
}


export interface SugerenciaAmigo {
  id: string;
  nombre: string;
  apellido: string;
}

export interface LogroReal {
  id: number;
  nombre: string;
  desc: string | null;
  fecha: string;
  icono: string | null;
}

export interface ProximoObjetivo {
  nombre: string;
  desc: string;
  meta: number;
  actual: number;
}

export interface PerfilDashboardData {
  perfil: {
    nombre: string;
    apellido: string;
    fotoperfil: string | null;
    puntos: number;
  } | null;
  rachaGlobal: number;
  diasActivosMensuales: number;
  eficienciaMensual: number;
  diasEnElMes: number;
  actividad: ActividadItem[];
  amigos: AmigoReal[];
  sugerenciasAmigos: SugerenciaAmigo[];
  logros: LogroReal[];
  logroDestacado: LogroReal | null;
  proximoObjetivo: ProximoObjetivo;
  porcentajeObj: number;
}

export interface PointsHistoryEntry {
  idhistorial: string;
  idusuario: string;
  puntos: number;
  motivo: string;
  fecha: string;
}
