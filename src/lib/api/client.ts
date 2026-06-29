/**
 * @file src/lib/api/client.ts
 * @description Cliente de API centralizado para comunicarse con el backend en NestJS.
 * Extrae y pasa el token JWT de Supabase de manera automática.
 * @layer Presentation & Integration (Capa 1/2 — Server-side)
 */

import { ok, err }       from "@/lib/result";
import type { Result }   from "@/lib/result";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

let tokenGetter: (() => Promise<string | null>) | null = null;

/**
 * Permite registrar la función para obtener el token desde el servidor de forma dinámica.
 */
export function setTokenGetter(getter: () => Promise<string | null>) {
  tokenGetter = getter;
}

/**
 * Obtiene las cabeceras de autorización con el Bearer JWT del usuario autenticado.
 */
async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    let token = null;
    if (tokenGetter) {
      token = await tokenGetter();
    } else if (typeof window !== "undefined") {
      // Entorno del Cliente (Navegador)
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token || null;
    }

    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch (error) {
    console.error("Error al obtener token de sesión de Supabase:", error);
  }
  return {};
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * Wrapper genérico de fetch que gestiona la comunicación de red y los errores.
 */
async function request<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Result<T>> {
  const { params, headers: customHeaders, ...rest } = options;

  let url = `${API_URL}/${endpoint.replace(/^\//, "")}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const authHeader = await getAuthHeader();

  const headers = {
    "Content-Type": "application/json",
    ...authHeader,
    ...customHeaders,
  };

  try {
    const response = await fetch(url, {
      ...rest,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `Error en la petición: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.message) {
          errorMessage = Array.isArray(errorData.message)
            ? errorData.message.join(", ")
            : errorData.message;
        }
      } catch {
        // Ignorar si el cuerpo no es JSON legible
      }
      return err(errorMessage);
    }

    if (response.status === 204) {
      return ok({} as T);
    }

    const data = await response.json();
    return ok(data);
  } catch (error: any) {
    console.error(`Error de red en endpoint "${endpoint}":`, error);
    return err(error?.message || "Error de red al conectar con el servidor backend");
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
