export type Role = "admin" | "user" | "trainer";

export interface User {
  id: string;
  email: string;
  role: Role;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  // Profile fields
  nombre?: string;
  apellido?: string;
  nombrerol?: string;
  fotoperfil?: string;
  // Supabase Auth / OAuth fields
  full_name?: string;
  avatar_url?: string;
}

export interface CreateUserDTO {
  email: string;
  passwordHash: string; // assume already hashed
  role?: Role;
  extra?: Record<string, unknown>;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
