import StatCard from './StatCard'
import ReferralInsights from './ReferralInsights'

export default function ReferralStats({ data }) {
  if (data?.error) {
    return (
      <div className="bg-ho-burgundy/10 border border-ho-burgundy p-4">
        <p className="text-ho-burgundy text-sm">Failed to load referral data: {data.error}</p>
      </div>
    )
  }

  if (!data?.stats) {
    return (
      <div className="bg-ho-tan/30 p-4">
        <p className="text-ho-charcoal text-sm">No referral data available</p>
      </div>
    )
  }

  const { stats, recentActivity, trends } = data

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          colorClass="text-ho-forest"
        />
        <StatCard
          label="Total Points"
          value={stats.totalPoints}
          sublabel="In circulation"
          colorClass="text-ho-forest"
        />
        <StatCard
          label="Total Referrals"
          value={stats.totalReferrals}
          colorClass="text-ho-bronze"
        />
        <StatCard
          label="Pending Fraud"
          value={stats.fraud?.pending || 0}
          sublabel="Needs review"
          colorClass={stats.fraud?.pending > 0 ? 'text-ho-burgundy' : 'text-ho-tan'}
        />
      </div>

      {/* Program Insights */}
      <ReferralInsights stats={stats} recentActivity={recentActivity} trends={trends} />

    </div>
  )
}
