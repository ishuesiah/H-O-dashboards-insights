export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Clear the session cookie
  res.setHeader('Set-Cookie', 'session=; Path=/; HttpOnly; Max-Age=0');

  return res.status(200).json({ success: true });
}
