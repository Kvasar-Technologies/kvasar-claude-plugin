/**
 * Authentication module for Kvasar plugin.
 * Uses Auth0 Resource Owner Password flow to obtain JWT tokens
 * from environment credentials KVASAR_EMAIL and KVASAR_PASSWORD.
 */

const { JWT } = require('jose'); // Not needed? We just handle token.

interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // unix timestamp in seconds
}

let cachedToken: string | null = null;
let refreshToken: string | null = null;
let expiresAt: number = 0;

function getAuth0Config() {
  const domain = process.env.AUTH0_DOMAIN || 'https://kvasar-pro.eu.auth0.com';
  const clientId = process.env.AUTH0_CLIENT_ID || 'TJAjLrdPvFPDBqtSr15fvIer15Ocl9EI';
  const audience = process.env.AUTH0_AUDIENCE || 'https://api.kvasar.tech/api/v1/';
  return { domain, clientId, audience };
}

async function performLogin(email: string, password: string): Promise<Tokens> {
  const { domain, clientId, audience } = getAuth0Config();
  const tokenUrl = `${domain}/oauth/token`;

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'password',
      username: email,
      password,
      audience,
      client_id: clientId,
      scope: 'openid profile email offline_access',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Auth failed: ${response.status} ${response.statusText}: ${errorText}`);
  }

  const data = await response.json();
  const now = Math.floor(Date.now() / 1000);
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: now + data.expires_in,
  };
}

async function performRefresh(token: string): Promise<Tokens> {
  const { domain, clientId, audience } = getAuth0Config();
  const tokenUrl = `${domain}/oauth/token`;

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: token,
      client_id: clientId,
      audience,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${response.statusText}: ${errorText}`);
  }

  const data = await response.json();
  const now = Math.floor(Date.now() / 1000);
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || token,
    expiresAt: now + data.expires_in,
  };
}

function isTokenValid(): boolean {
  if (!cachedToken) return false;
  const now = Math.floor(Date.now() / 1000);
  return now < expiresAt - 60; // 60s buffer
}

async function ensureAuth(): Promise<void> {
  // Check if we have valid tokens; if not, try to login using env credentials
  if (isTokenValid()) {
    return;
  }

  const email = process.env.KVASAR_EMAIL;
  const password = process.env.KVASAR_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing KVASAR_EMAIL or KVASAR_PASSWORD environment variables');
  }

  // If we have a refresh token, try to refresh first
  if (refreshToken) {
    try {
      const tokens = await performRefresh(refreshToken);
      cachedToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
      expiresAt = tokens.expiresAt;
      return;
    } catch (err) {
      // Refresh failed, fall back to password grant
      console.warn('Refresh failed, attempting password login:', err.message);
    }
  }

  // Perform full login
  const tokens = await performLogin(email, password);
  cachedToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  expiresAt = tokens.expiresAt;
}

/**
 * Get the Authorization header object for API calls.
 * Ensures a fresh token is available.
 */
export async function getAuthHeader(): Promise<{ Authorization: string }> {
  await ensureAuth();
  if (!cachedToken) {
    throw new Error('Authentication failed: no token obtained');
  }
  return { Authorization: `Bearer ${cachedToken}` };
}

/**
 * For debugging: clear cached tokens.
 */
export function clearCache(): void {
  cachedToken = null;
  refreshToken = null;
  expiresAt = 0;
}
