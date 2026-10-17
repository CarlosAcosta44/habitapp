/**
 * @file src/repositories/admin.repository.ts
 * @description Capa de Acceso a Datos (Repository) para el módulo admin.
 * Hereda los métodos HTTP de BaseRepository.
 */

import { BaseRepository } from "./base.repository";

export class AdminRepository extends BaseRepository {}

export const adminRepository = new AdminRepository();
