// Domain types for User module

export type Role = "admin" | "user" | "trainer";

export interface User {
  id: string;
  email: string;
  role: Role;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  // Add any extra fields stored in the DB as optional
  [key: string]: any;
}

export interface CreateUserDTO {
  email: string;
  passwordHash: string; // assume already hashed
  role?: Role;
  // any additional fields that should be persisted
  extra?: Record<string, any>;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
