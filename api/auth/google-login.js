import crypto from 'crypto';
import {
  GOOGLE_AUTH_URL,
  ALLOWED_EMAIL_DOMAIN,
  STATE_COOKIE,
  googleConfigured,
  callbackUrl,
  encodeStateToken,
  cookie,
} from './_oauth.js';

// Step 1: stash state + nonce in a signed cookie and send the browser to Google.
export default async function handler(req, res) {
  if (!googleConfigured()) {
    return res.redirect(302, '/?auth_error=not_configured');
  }

  const state = crypto.randomBytes(24).toString('base64url');
  const nonce = crypto.randomBytes(24).toString('base64url');
  const stateToken = encodeStateToken({ state, nonce, at: Date.now() });

  // SameSite=Lax so the cookie is sent on the cross-site redirect back from Google.
  res.setHeader(
    'Set-Cookie',
    cookie(STATE_COOKIE, stateToken, { maxAge: 600, sameSite: 'Lax' })
  );

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: callbackUrl(req),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    nonce,
    prompt: 'select_account',
    hd: ALLOWED_EMAIL_DOMAIN, // UI hint only; the domain is enforced in the callback
  });

  return res.redirect(302, `${GOOGLE_AUTH_URL}?${params}`);
}
