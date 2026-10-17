/**
 * @file src/repositories/amigos.repository.ts
 * @description Capa de Acceso a Datos (Repository) para el módulo amigos.
 * Hereda los métodos HTTP de BaseRepository.
 */

import { BaseRepository } from "./base.repository";

export class AmigosRepository extends BaseRepository {}

export const amigosRepository = new AmigosRepository();
