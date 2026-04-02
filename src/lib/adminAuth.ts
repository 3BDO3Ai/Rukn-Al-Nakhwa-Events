export const ADMIN_SESSION_COOKIE = "admin_session";

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

export function getExpectedAdminToken(): string | null {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return null;
  }
  return buildAdminSessionToken(adminPassword);
}

export function isAdminSessionValid(token: string | undefined): boolean {
  if (!token) {
    return false;
  }

  const expected = getExpectedAdminToken();
  if (!expected) {
    return false;
  }

  return token === expected;
}
