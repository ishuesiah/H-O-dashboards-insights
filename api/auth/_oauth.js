import crypto from 'crypto';

// Google OpenID Connect sign-in, mirroring the post-purchase-survey dashboard:
// no OAuth library, the flow is three HTTPS calls, and the id_token comes
// straight from Google's token endpoint over TLS using the client secret, so
// OIDC Core 3.1.3.7 allows skipping signature verification. Claims
// (iss, aud, exp, nonce, email_verified, domain) are still checked.

export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const GOOGLE_ISSUERS = new Set(['https://accounts.google.com', 'accounts.google.com']);

export const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
export const STATE_COOKIE = 'oauth_state';

export const ALLOWED_EMAIL_DOMAIN = (
  process.env.ALLOWED_EMAIL_DOMAIN || 'hemlockandoak.com'
).toLowerCase();

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

function jwtSecret() {
  return process.env.JWT_SECRET || 'fallback-secret';
}

function appOrigin(req) {
  const configured = process.env.APP_URL;
  if (configured) return configured.replace(/\/$/, '');
  // Behind Vercel's proxy the incoming request is http; trust the forwarded
  // protocol/host so the redirect URI matches what Google has on file.
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

export function callbackUrl(req) {
  return `${appOrigin(req)}/api/auth/google-callback`;
}

function sign(payload) {
  return crypto.createHmac('sha256', jwtSecret()).update(payload).digest('hex');
}

/** Signs { state, nonce, at } into a cookie-safe token. */
export function encodeStateToken(data) {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

/** Verifies and decodes the state token; returns null if invalid or stale. */
export function decodeStateToken(token) {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  if (!safeEqual(signature, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (Date.now() - data.at > OAUTH_STATE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

/** Creates the signed session token in the same format verifySession() expects. */
export function createSessionToken(extra = {}) {
  const sessionData = {
    role: 'admin',
    ...extra,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  const payload = Buffer.from(JSON.stringify(sessionData)).toString('base64');
  return `${payload}.${sign(payload)}`;
}

export function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    cookies[name] = rest.join('=');
  });
  return cookies;
}

export function cookie(name, value, { maxAge, sameSite = 'Strict' } = {}) {
  const parts = [`${name}=${value}`, 'HttpOnly', 'Path=/', `SameSite=${sameSite}`];
  if (maxAge !== undefined) parts.push(`Max-Age=${maxAge}`);
  if (process.env.NODE_ENV === 'production') parts.push('Secure');
  return parts.join('; ');
}

export function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function decodeJwtClaims(jwt) {
  if (typeof jwt !== 'string') return null;
  const parts = jwt.split('.');
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}
