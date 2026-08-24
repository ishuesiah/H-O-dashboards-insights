import { useState } from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, AreaChart, Area,
  CartesianGrid
} from 'recharts'

const TIER_COLORS = {
  Bronze: '#b45309',
  Silver: '#6b7280',
  Gold: '#eab308',
  VIP: '#9333ea'
}

const TABS = [
  { id: 'tiers', label: 'Tier Distribution' },
  { id: 'activity', label: 'Activity (Last 7 Days)' },
  { id: 'points', label: 'Points & Referrals' },
  { id: 'conversion', label: 'Conversion Funnel' },
  { id: 'trends', label: 'Daily Trends (7 Days)' }
]

export default function ReferralInsights({ stats, recentActivity, trends }) {
  const [activeTab, setActiveTab] = useState('tiers')

  const tiers = stats?.tiers || {}

  // Helper to get tier value (handles both lowercase and capitalized keys)
  const getTierValue = (name) => {
    return tiers[name] || tiers[name.toLowerCase()] || 0
  }

  // Prepare tier data for pie chart
  const tierData = [
    { name: 'Bronze', value: getTierValue('Bronze'), color: TIER_COLORS.Bronze },
    { name: 'Silver', value: getTierValue('Silver'), color: TIER_COLORS.Silver },
    { name: 'Gold', value: getTierValue('Gold'), color: TIER_COLORS.Gold },
    { name: 'VIP', value: getTierValue('VIP') || getTierValue('vip'), color: TIER_COLORS.VIP }
  ].filter(t => t.value > 0)

  // Prepare activity data for bar chart
  const activityData = (recentActivity || []).slice(0, 8).map(a => ({
    name: a.action_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count: a.count,
    points: a.total_points || 0
  }))

  // Get total referrals (check multiple possible property names)
  const totalReferrals = stats?.totalReferrals || stats?.successfulReferrals || stats?.referralCount || 0

  // Points & Referrals summary data
  const pointsReferralsData = [
    { name: 'Total Users', value: stats?.totalUsers || 0 },
    { name: 'Total Referrals', value: totalReferrals },
    { name: 'Avg Points/User', value: stats?.totalUsers ? Math.round((stats?.totalPoints || 0) / stats.totalUsers) : 0 }
  ]

  // Conversion funnel data
  const totalUsers = stats?.totalUsers || 0
  const usersWithReferrals = stats?.usersWithReferrals || stats?.referrers || Math.round(totalUsers * 0.3)
  const conversionData = [
    { stage: 'Total Users', value: totalUsers, fill: '#6366f1' },
    { stage: 'Made Referrals', value: usersWithReferrals, fill: '#8b5cf6' },
    { stage: 'Successful Referrals', value: totalReferrals, fill: '#10b981' }
  ]

  // Weekly trends data from API
  const trendsData = (trends || []).map(day => {
    const date = new Date(day.date)
    return {
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      signups: day.signups || 0,
      referrals: day.referrals || 0,
      points: day.points || 0
    }
  })

  const renderChart = () => {
    switch (activeTab) {
      case 'tiers':
        return (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => {
                    const pct = percent * 100
                    if (pct < 0.1) return `${name} <0.1%`
                    if (pct < 1) return `${name} ${pct.toFixed(1)}%`
                    return `${name} ${pct.toFixed(0)}%`
                  }}
                >
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )

      case 'activity':
        return (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Actions" fill="#6366f1" />
                <Bar dataKey="points" name="Points" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )

      case 'points':
        return (
          <div className="h-72">
            <div className="grid grid-cols-3 gap-4 h-full">
              {pointsReferralsData.map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-indigo-600">{item.value.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 mt-2">{item.name}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Points in Circulation</span>
                <span className="text-2xl font-bold text-green-600">{(stats?.totalPoints || 0).toLocaleString()}</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((stats?.totalPoints || 0) / 100000) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )

      case 'conversion':
        const formatPercent = (pct) => {
          if (pct < 0.01) return '<0.01%'
          if (pct < 0.1) return `${pct.toFixed(2)}%`
          if (pct < 1) return `${pct.toFixed(1)}%`
          return `${pct.toFixed(1)}%`
        }
        return (
          <div className="h-72 flex flex-col justify-center space-y-4">
            {conversionData.map((stage, i) => {
              const widthPercent = totalUsers > 0 ? (stage.value / totalUsers) * 100 : 0
              return (
                <div key={i} className="relative">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{stage.stage}</span>
                    <span className="text-gray-600">{stage.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-8">
                    <div
                      className="h-8 rounded-full transition-all flex items-center justify-end pr-3"
                      style={{ width: `${Math.max(widthPercent, 10)}%`, backgroundColor: stage.fill }}
                    >
                      <span className="text-white text-sm font-medium">
                        {formatPercent(widthPercent)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Conversion Rate:</strong> {totalUsers > 0 ? formatPercent((totalReferrals / totalUsers) * 100) : '0%'} of users have successful referrals
              </p>
            </div>
          </div>
        )

      case 'trends':
        return (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="signups" name="Signups" stroke="#6366f1" fill="#c7d2fe" />
                <Area type="monotone" dataKey="referrals" name="Referrals" stroke="#10b981" fill="#a7f3d0" />
              </AreaChart>
            </ResponsiveContainer>
{trendsData.length === 0 && (
              <p className="text-xs text-gray-400 text-center mt-2">No trend data available</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Program Insights</h3>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4 overflow-x-auto" aria-label="Tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Chart Content */}
      {renderChart()}
    </div>
  )
}
