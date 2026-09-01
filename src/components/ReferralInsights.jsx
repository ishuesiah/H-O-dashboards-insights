import { useState } from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, AreaChart, Area,
  CartesianGrid
} from 'recharts'
import { useTrendPeople } from '../hooks/useStats'

// Hemlock & Oak brand colors
const HO_COLORS = {
  forest: '#293e1c',
  bronze: '#a47738',
  burgundy: '#711d2f',
  tan: '#d4c5a9',
  charcoal: '#1a1a1a',
  cream: '#f4f4f2'
}

const TIER_COLORS = {
  Bronze: HO_COLORS.bronze,
  Silver: '#6b7280',
  Gold: '#d4a84b',
  VIP: HO_COLORS.burgundy
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
  const [selectedTrendKey, setSelectedTrendKey] = useState(null) // 'signups' | 'referrals' | null
  const {
    data: peopleData,
    error: peopleError,
    isLoading: peopleLoading
  } = useTrendPeople(activeTab === 'trends' && selectedTrendKey !== null)

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
    { stage: 'Total Users', value: totalUsers, fill: HO_COLORS.forest },
    { stage: 'Made Referrals', value: usersWithReferrals, fill: HO_COLORS.bronze },
    { stage: 'Successful Referrals', value: totalReferrals, fill: HO_COLORS.burgundy }
  ]

  // Weekly trends data from API
  const trendsData = (trends || []).map(day => {
    const date = new Date(day.date)
    return {
      date: day.date, // raw 'YYYY-MM-DD' key, used to look up drill-down people lists
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      signups: day.signups || 0,
      referrals: day.referrals || 0,
      points: day.points || 0
    }
  })

  const handleLegendClick = (item) => {
    const key = item?.dataKey ?? item?.payload?.dataKey
      ?? ({ Signups: 'signups', Referrals: 'referrals' }[item?.value])
    if (key === 'signups' || key === 'referrals') {
      setSelectedTrendKey(prev => (prev === key ? null : key))
    }
  }

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
                <Bar dataKey="count" name="Actions" fill={HO_COLORS.forest} />
                <Bar dataKey="points" name="Points" fill={HO_COLORS.bronze} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )

      case 'points':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {pointsReferralsData.map((item, i) => (
                <div key={i} className="bg-ho-cream border-l-4 border-ho-forest p-6 flex flex-col items-center justify-center">
                  <div className="text-4xl font-light text-ho-forest">{item.value.toLocaleString()}</div>
                  <div className="text-sm text-ho-charcoal mt-2">{item.name}</div>
                </div>
              ))}
            </div>
            <div className="bg-ho-tan/30 p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-ho-charcoal">Total Points in Circulation</span>
                <span className="text-2xl font-light text-ho-forest">{(stats?.totalPoints || 0).toLocaleString()}</span>
              </div>
              <div className="mt-2 w-full bg-ho-tan h-2">
                <div
                  className="bg-ho-forest h-2 transition-all"
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
                    <span className="text-ho-charcoal font-medium">{stage.stage}</span>
                    <span className="text-ho-charcoal">{stage.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-ho-tan h-8">
                    <div
                      className="h-8 transition-all flex items-center justify-end pr-3"
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
            <div className="mt-4 p-4 bg-ho-forest/10 border-l-4 border-ho-forest">
              <p className="text-sm text-ho-charcoal">
                <strong>Conversion Rate:</strong> {totalUsers > 0 ? formatPercent((totalReferrals / totalUsers) * 100) : '0%'} of users have successful referrals
              </p>
            </div>
          </div>
        )

      case 'trends':
        return (
          <div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend wrapperStyle={{ cursor: 'pointer' }} onClick={handleLegendClick} />
                  <Area type="monotone" dataKey="signups" name="Signups" stroke={HO_COLORS.forest} fill={`${HO_COLORS.forest}40`} />
                  <Area type="monotone" dataKey="referrals" name="Referrals" stroke={HO_COLORS.bronze} fill={`${HO_COLORS.bronze}40`} />
                </AreaChart>
              </ResponsiveContainer>
              {trendsData.length === 0 && (
                <p className="text-xs text-ho-charcoal/50 text-center mt-2">No trend data available</p>
              )}
            </div>
            {!selectedTrendKey && trendsData.length > 0 && (
              <p className="text-xs text-ho-charcoal/40 text-center mt-1">
                Click "Signups" or "Referrals" in the legend to see who they are
              </p>
            )}
            {selectedTrendKey && (
              <div className="mt-4 border border-ho-tan">
                <div className="px-4 py-2 bg-ho-cream border-b border-ho-tan flex justify-between items-center">
                  <span className="text-xs font-medium text-ho-charcoal/60 uppercase tracking-wider">
                    {selectedTrendKey === 'signups' ? 'Signups' : 'Referrals'} — Last 7 Days
                  </span>
                  <button
                    onClick={() => setSelectedTrendKey(null)}
                    className="text-xs text-ho-charcoal/60 hover:text-ho-charcoal"
                  >
                    Close
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-ho-tan/50">
                  {peopleLoading && (
                    <div className="px-4 py-8 text-center text-sm text-ho-charcoal/60">Loading...</div>
                  )}
                  {peopleError && (
                    <div className="px-4 py-8 text-center text-sm text-ho-burgundy">
                      Failed to load the list. Please try again.
                    </div>
                  )}
                  {peopleData && trendsData.map(day => {
                    const entries = peopleData[selectedTrendKey]?.[day.date] || []
                    return (
                      <div key={day.date}>
                        <div className="px-4 py-1.5 bg-ho-cream/60 text-xs font-medium text-ho-charcoal sticky top-0">
                          {day.name} <span className="text-ho-charcoal/50">({entries.length})</span>
                        </div>
                        {entries.length === 0 ? (
                          <div className="px-4 py-2 text-xs text-ho-charcoal/40">
                            No {selectedTrendKey} this day
                          </div>
                        ) : entries.map((p, i) => (
                          <div key={i} className="px-4 py-2 text-sm text-ho-charcoal hover:bg-ho-cream/50">
                            {selectedTrendKey === 'signups' ? (
                              <>
                                <span className="font-medium">{`${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Unknown'}</span>
                                <span className="text-ho-charcoal/60"> ({p.email})</span>
                                {p.wasReferred && (
                                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-ho-bronze/20 text-ho-bronze">referred</span>
                                )}
                              </>
                            ) : (
                              <>
                                <span className="font-medium">{p.referrerName || 'Unknown'}</span>
                                {' referred '}
                                <span className="font-medium">{p.referredName || 'someone'}</span>
                                {p.referredEmail && (
                                  <span className="text-ho-charcoal/60"> ({p.referredEmail})</span>
                                )}
                                {' — '}
                                <span className="text-ho-charcoal/60">
                                  {p.bonusType === 'first_purchase' ? 'first purchase bonus' : 'signup bonus'},
                                  {' '}+{(p.points || 0).toLocaleString()} pts
                                </span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                  {peopleData?.truncated && (
                    <div className="px-4 py-2 text-xs text-ho-charcoal/40 text-center">
                      List truncated at 500 entries
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white shadow-sm p-6">
      <h3 className="text-sm font-medium text-ho-charcoal mb-4">Program Insights</h3>

      {/* Tabs */}
      <div className="border-b border-ho-tan mb-6">
        <nav className="flex space-x-4 overflow-x-auto" aria-label="Tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setSelectedTrendKey(null)
              }}
              className={`whitespace-nowrap py-2 px-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-ho-forest text-ho-forest'
                  : 'border-transparent text-ho-charcoal/60 hover:text-ho-charcoal hover:border-ho-tan'
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
