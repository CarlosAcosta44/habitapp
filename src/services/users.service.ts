import { ok, err } from '@/lib/result';
import type { Result } from '@/lib/result';
import type { User, CreateUserDTO, LoginUserDTO } from '@/types/domain/user.types';
import { UsersRepository } from '@/repositories/users.repository';

export class UsersService {
  private readonly repo: UsersRepository;

  constructor(repo?: UsersRepository) {
    this.repo = repo ?? new UsersRepository();
  }

  async createUser(dto: CreateUserDTO): Promise<Result<User>> {
    // Here you could add business validations before delegating to repository
    return this.repo.createUser(dto);
  }

  async findByEmail(email: string): Promise<Result<User | null>> {
    return this.repo.findByEmail(email);
  }

  async findById(id: string): Promise<Result<User | null>> {
    return this.repo.findById(id);
  }

  async deleteUser(id: string): Promise<Result<boolean>> {
    // Additional checks (e.g., ownership) could be added here
    return this.repo.deleteUser(id);
  }
}
