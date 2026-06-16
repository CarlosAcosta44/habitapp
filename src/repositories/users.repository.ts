import { createClient } from '@/lib/supabase/server';
import { ok, err } from '@/lib/result';
import type { Result } from '@/lib/result';
import type { User, CreateUserDTO, LoginUserDTO } from '@/types/domain/user.types';

export class UsersRepository {
  async createUser(dto: CreateUserDTO): Promise<Result<User>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .schema('public')
      .from('users')
      .insert({
        email: dto.email,
        password_hash: dto.passwordHash, // assuming hashing done before call
        role: dto.role ?? 'user',
        ...dto.extra,
      })
      .single();
    if (error) return err(`Error creating user: ${error.message}`);
    return ok(data as unknown as User);
  }

  async findByEmail(email: string): Promise<Result<User | null>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .schema('public')
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') return err(`Error fetching user: ${error.message}`);
    return ok(data ? (data as unknown as User) : null);
  }

  async findById(id: string): Promise<Result<User | null>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .schema('public')
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') return err(`Error fetching user by id: ${error.message}`);
    return ok(data ? (data as unknown as User) : null);
  }

  async deleteUser(id: string): Promise<Result<boolean>> {
    const supabase = await createClient();
    const { error } = await supabase
      .schema('public')
      .from('users')
      .delete()
      .eq('id', id);
    if (error) return err(`Error deleting user: ${error.message}`);
    return ok(true);
  }
}
