import crypto from 'crypto';

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    cookies[name] = rest.join('=');
  });

  return cookies;
}

export function verifySession(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.session;

  if (!token) return false;

  try {
    const [sessionToken, signature] = token.split('.');
    if (!sessionToken || !signature) return false;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'fallback-secret')
      .update(sessionToken)
      .digest('hex');

    const isValidSignature = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValidSignature) return false;

    // Parse and check expiration
    const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString());

    if (sessionData.exp < Date.now()) return false;

    return true;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const isAuthenticated = verifySession(req);

  return res.status(200).json({ authenticated: isAuthenticated });
}
