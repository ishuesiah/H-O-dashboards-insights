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
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 30);

  // Fetch from all sources in parallel
  const [referral, referralTrends, referralInsights, addressWebhook, customizationWebhook] = await Promise.allSettled([
    // Referral Program Stats
    fetch(`${process.env.REFERRAL_API_URL}/api/dashboard/stats?secret=${referralSecret}`, {
      headers: { 'X-Dashboard-Secret': referralSecret }
    }).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }),

    // Referral Program Trends (daily series for the selected range)
    fetch(`${process.env.REFERRAL_API_URL}/api/dashboard/trends?secret=${referralSecret}&days=${days}`, {
      headers: { 'X-Dashboard-Secret': referralSecret }
    }).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }),

    // Referral Program Insights (points economy, redemptions, conversion, leaderboard, fraud)
    fetch(`${process.env.REFERRAL_API_URL}/api/dashboard/insights?secret=${referralSecret}&days=${days}`, {
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
        trends: referralTrends.status === 'fulfilled' ? referralTrends.value.trends : [],
        insights: referralInsights.status === 'fulfilled' ? referralInsights.value : null
      }
    : { error: referral.reason?.message || 'Failed to fetch' };

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    days,
    referral: referralData,
    addressWebhook: addressWebhook.status === 'fulfilled'
      ? addressWebhook.value
      : { error: addressWebhook.reason?.message || 'Failed to fetch' },
    customizationWebhook: customizationWebhook.status === 'fulfilled'
      ? customizationWebhook.value
      : { error: customizationWebhook.reason?.message || 'Failed to fetch' }
  });
}
