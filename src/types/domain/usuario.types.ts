/**
 * @file src/types/domain/usuario.types.ts
 * @description Tipos de datos para el dominio de Usuarios.
 */

export enum UserRole {
  USER = 'usuario',
  TRAINER = 'entrenador',
  ADMIN = 'administrador',
}

export enum RoleName {
  USER = 'Usuario',
  TRAINER = 'Entrenador',
  ADMIN = 'Administrador',
}

export interface UserProfileDto {
  idusuario: string;
  nombre: string;
  apellido: string;
  fotoperfil: string | null;
  telefono?: string | null;
  genero?: string | null;
  fechanacimiento?: string | null;
  puntostotales: number;
  idrol: string;
  nombrerol: string;
}

export interface UpdateUserProfileDto {
  nombre?: string;
  apellido?: string;
  fotoperfil?: string;
  telefono?: string;
  genero?: string;
  fechanacimiento?: string;
}
