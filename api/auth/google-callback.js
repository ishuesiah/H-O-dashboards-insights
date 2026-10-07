import {
  GOOGLE_TOKEN_URL,
  GOOGLE_ISSUERS,
  ALLOWED_EMAIL_DOMAIN,
  STATE_COOKIE,
  callbackUrl,
  decodeStateToken,
  createSessionToken,
  parseCookies,
  cookie,
  safeEqual,
  decodeJwtClaims,
} from './_oauth.js';

// Step 2: validate state, exchange the code, check the id_token claims,
// then set the session cookie and land on the dashboard.
export default async function handler(req, res) {
  const clearState = cookie(STATE_COOKIE, '', { maxAge: 0, sameSite: 'Lax' });

  const fail = (code, detail) => {
    if (detail) console.warn(`[auth] Google login rejected (${code}): ${detail}`);
    res.setHeader('Set-Cookie', clearState);
    return res.redirect(302, `/?auth_error=${code}`);
  };

  const { code, state, error } = req.query;
  if (error) return fail('denied', error);

  const pending = decodeStateToken(parseCookies(req.headers.cookie)[STATE_COOKIE]);
  if (!code || !state || !pending || !safeEqual(state, pending.state)) {
    return fail('state', 'missing, mismatched or stale state');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: callbackUrl(req),
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenResponse.ok) return fail('exchange', `token endpoint ${tokenResponse.status}`);
  const tokens = await tokenResponse.json();

  const claims = decodeJwtClaims(tokens.id_token);
  if (
    !claims ||
    !GOOGLE_ISSUERS.has(claims.iss) ||
    claims.aud !== clientId ||
    !(Number(claims.exp) * 1000 > Date.now()) ||
    !claims.nonce ||
    !safeEqual(claims.nonce, pending.nonce)
  ) {
    return fail('token', 'id_token claims failed validation');
  }

  const email = String(claims.email || '').toLowerCase();
  if (claims.email_verified !== true || !email.endsWith(`@${ALLOWED_EMAIL_DOMAIN}`)) {
    return fail('domain', email || '(no email)');
  }

  // Success: set the session cookie (same format verifySession() checks).
  const sessionToken = createSessionToken({ email, name: claims.name || email });
  res.setHeader('Set-Cookie', [
    cookie('session', sessionToken, { maxAge: 86400 }),
    clearState,
  ]);

  console.log(`[auth] Google login: ${email}`);
  return res.redirect(302, '/');
}
