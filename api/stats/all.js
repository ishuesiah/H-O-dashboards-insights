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

  const webhookApiKey = process.env.WEBHOOK_API_KEY;
  const referralSecret = process.env.REFERRAL_API_SECRET;

  // Fetch from all sources in parallel
  const [referral, referralTrends, addressWebhook, customizationWebhook] = await Promise.allSettled([
    // Referral Program Stats
    fetch(`${process.env.REFERRAL_API_URL}/api/dashboard/stats?secret=${referralSecret}`, {
      headers: { 'X-Dashboard-Secret': referralSecret }
    }).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }),

    // Referral Program Trends (last 7 days)
    fetch(`${process.env.REFERRAL_API_URL}/api/dashboard/trends?secret=${referralSecret}&days=7`, {
      headers: { 'X-Dashboard-Secret': referralSecret }
    }).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }),

    // Address Issue Webhook
    fetch(`${process.env.ADDRESS_WEBHOOK_URL}/api/stats`, {
      headers: { 'X-API-Key': webhookApiKey }
    }).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }),

    // Order Customization Webhook
    fetch(`${process.env.CUSTOMIZATION_WEBHOOK_URL}/api/stats`, {
      headers: { 'X-API-Key': webhookApiKey }
    }).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
  ]);

  // Merge referral stats and trends
  const referralData = referral.status === 'fulfilled'
    ? {
        ...referral.value,
        trends: referralTrends.status === 'fulfilled' ? referralTrends.value.trends : []
      }
    : { error: referral.reason?.message || 'Failed to fetch' };

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    referral: referralData,
    addressWebhook: addressWebhook.status === 'fulfilled'
      ? addressWebhook.value
      : { error: addressWebhook.reason?.message || 'Failed to fetch' },
    customizationWebhook: customizationWebhook.status === 'fulfilled'
      ? customizationWebhook.value
      : { error: customizationWebhook.reason?.message || 'Failed to fetch' }
  });
}
