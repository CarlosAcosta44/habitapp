import { cookies } from "next/headers";

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export interface SessionTokensInput {
  accessToken: string;
  refreshToken?: string;
  roleId?: string | number;
}

/**
 * Persists the session cookies (`access_token`, optional `refresh_token`, and optional `user_role`).
 */
export async function setSessionCookies({
  accessToken,
  refreshToken,
  roleId,
}: SessionTokensInput): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken, SESSION_COOKIE_OPTIONS);

  if (refreshToken) {
    cookieStore.set("refresh_token", refreshToken, SESSION_COOKIE_OPTIONS);
  }

  if (roleId !== undefined && roleId !== null) {
    cookieStore.set("user_role", roleId.toString(), { path: "/" });
  }
}

/**
 * Clears all session-related cookies on logout.
 */
export async function clearSessionCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("user_role");
}
