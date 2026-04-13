/**
 * @file src/lib/interfaces/repository.interface.ts
 * @description Contratos base que todos los repositorios deben cumplir.
 * @principle OCP: cerradas para modificación, abiertas para extensión.
 * @principle DIP: los servicios dependen de estas abstracciones, no de Supabase.
 */

import type { Result } from "@/lib/result";

export interface IReadableRepository<T> {
  findById(id: string): Promise<Result<T | null>>;
  findAll(): Promise<Result<T[]>>;
}

export interface IWritableRepository<T, CreateDTO> {
  create(data: CreateDTO): Promise<Result<T>>;
  update(id: string, data: Partial<CreateDTO>): Promise<Result<T | null>>;
  delete(id: string): Promise<Result<boolean>>;
}

export interface IUserScopedRepository<T> {
  findByUserId(userId: string): Promise<Result<T[]>>;
}

export interface IRepository<T, CreateDTO>
  extends IReadableRepository<T>,
          IWritableRepository<T, CreateDTO> {}