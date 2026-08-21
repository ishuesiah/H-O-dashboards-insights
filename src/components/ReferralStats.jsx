import StatCard from './StatCard'

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

  const { stats, recentSignups, recentActivity } = data
  const tiers = stats.tiers || {}

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

      {/* Tier Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Users by Tier</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-700">{tiers.Bronze || 0}</div>
            <div className="text-xs text-gray-500">Bronze</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">{tiers.Silver || 0}</div>
            <div className="text-xs text-gray-500">Silver</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{tiers.Gold || 0}</div>
            <div className="text-xs text-gray-500">Gold</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{tiers.VIP || 0}</div>
            <div className="text-xs text-gray-500">VIP</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity && recentActivity.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Activity (Last 7 Days)</h3>
          <div className="space-y-2">
            {recentActivity.slice(0, 5).map((activity, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{activity.action_type.replace(/_/g, ' ')}</span>
                <span className="text-gray-900 font-medium">
                  {activity.count} actions ({activity.total_points?.toLocaleString() || 0} pts)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Signups */}
      {recentSignups && recentSignups.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Signups</h3>
          <div className="space-y-2">
            {recentSignups.slice(0, 5).map((user, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{user.firstName} ({user.email})</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  user.tier === 'VIP' ? 'bg-purple-100 text-purple-700' :
                  user.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                  user.tier === 'Silver' ? 'bg-gray-100 text-gray-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {user.tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
