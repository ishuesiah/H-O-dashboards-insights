import crypto from 'crypto';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  // Hash the provided password
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
  const expectedHash = process.env.DASHBOARD_PASSWORD_HASH;

  if (!expectedHash) {
    console.error('DASHBOARD_PASSWORD_HASH not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Timing-safe comparison
  const isValid = crypto.timingSafeEqual(
    Buffer.from(passwordHash),
    Buffer.from(expectedHash)
  );

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Create a simple session token (JWT-like but simpler for this use case)
  const sessionData = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };

  const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');
  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'fallback-secret')
    .update(sessionToken)
    .digest('hex');

  const token = `${sessionToken}.${signature}`;

  // Set HTTP-only cookie
  const cookieOptions = [
    `session=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Strict',
    'Max-Age=86400', // 24 hours
  ];

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieOptions.join('; '));

  return res.status(200).json({ success: true });
}
