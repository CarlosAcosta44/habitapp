/**
 * @file src/repositories/auth.repository.ts
 * @description Capa de Acceso a Datos (Repository) para el módulo auth.
 * Hereda los métodos HTTP de BaseRepository.
 */

import { BaseRepository } from "./base.repository";

export class AuthRepository extends BaseRepository {}

export const authRepository = new AuthRepository();
