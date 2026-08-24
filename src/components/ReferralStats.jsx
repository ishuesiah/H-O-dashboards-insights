import StatCard from './StatCard'
import ReferralInsights from './ReferralInsights'

export default function ReferralStats({ data }) {
  if (data?.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">Failed to load referral data: {data.error}</p>
      </div>
    )
  }

  if (!data?.stats) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500 text-sm">No referral data available</p>
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
          colorClass="text-indigo-600"
        />
        <StatCard
          label="Total Points"
          value={stats.totalPoints}
          sublabel="In circulation"
          colorClass="text-green-600"
        />
        <StatCard
          label="Total Referrals"
          value={stats.totalReferrals}
          colorClass="text-blue-600"
        />
        <StatCard
          label="Pending Fraud"
          value={stats.fraud?.pending || 0}
          sublabel="Needs review"
          colorClass={stats.fraud?.pending > 0 ? 'text-red-600' : 'text-gray-400'}
        />
      </div>

      {/* Program Insights */}
      <ReferralInsights stats={stats} recentActivity={recentActivity} trends={trends} />

    </div>
  )
}
