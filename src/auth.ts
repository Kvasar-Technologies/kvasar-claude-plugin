/**
 * Authentication module for Kvasar plugin.
 * Uses a pre-generated JWT token from KVASAR_TOKEN environment variable.
 */

let cachedToken: string | null = null;

function isTokenValid(): boolean {
  return cachedToken !== null && cachedToken.length > 0;
}

async function ensureAuth(): Promise<void> {
  if (isTokenValid()) {
    return;
  }

  const token = process.env.KVASAR_TOKEN;

  if (!token) {
    throw new Error('Missing KVASAR_TOKEN environment variable. Obtain a JWT token from Kvasar and set it in your environment.');
  }

  cachedToken = token;
}

/**
 * Get the Authorization header object for API calls.
 */
export async function getAuthHeader(): Promise<{ Authorization: string }> {
  await ensureAuth();
  if (!cachedToken) {
    throw new Error('Authentication failed: no token obtained');
  }
  return { Authorization: `Bearer ${cachedToken}` };
}

/**
 * For debugging: clear cached token.
 */
export function clearCache(): void {
  cachedToken = null;
}
