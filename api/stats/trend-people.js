import { verifySession } from '../auth/check.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!verifySession(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const r = await fetch(
      `${process.env.REFERRAL_API_URL}/api/dashboard/trends/people?days=7`,
      { headers: { 'X-Dashboard-Secret': process.env.REFERRAL_API_SECRET } }
    );
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return res.status(200).json(await r.json());
  } catch (err) {
    return res.status(502).json({ error: err.message || 'Failed to fetch trend people' });
  }
}
