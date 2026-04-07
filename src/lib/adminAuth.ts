export const ADMIN_SESSION_COOKIE = "admin_session";
export const DEFAULT_ADMIN_PASSWORD = "Al-Nakhwa_Admin@123";

function stringHash(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

export function buildAdminSessionToken(adminPassword: string): string {
  return `v1_${stringHash(`pto-admin:${adminPassword}:session`)}`;
}

export function getAdminPassword(): string {
  const configured = process.env.ADMIN_PASSWORD?.trim();
  if (configured) {
    return configured;
  }

  return DEFAULT_ADMIN_PASSWORD;
}

export function getExpectedAdminToken(): string {
  return buildAdminSessionToken(getAdminPassword());
}

export function isAdminSessionValid(token: string | undefined): boolean {
  if (!token) {
    return false;
  }

  const expected = getExpectedAdminToken();
  return token === expected;
}
