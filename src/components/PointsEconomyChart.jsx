import {
  AreaChart, Area, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer
} from 'recharts'
import { HO_COLORS } from './ReferralInsights'

export default function PointsEconomyChart({ economy, expiring }) {
  const chartData = (economy || []).map(day => ({
    ...day,
    name: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }))

  const expiringCards = [
    { label: 'Expiring ≤ 14 days', data: expiring?.in14 },
    { label: 'Expiring ≤ 30 days', data: expiring?.in30 }
  ]

  return (
    <div className="space-y-4">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {/* Not stacked: redeemed/expired are outflows, not parts of earned */}
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Legend />
            <Area type="monotone" dataKey="earned" name="Earned" stroke={HO_COLORS.forest} fill={`${HO_COLORS.forest}40`} />
            <Area type="monotone" dataKey="redeemed" name="Redeemed" stroke={HO_COLORS.burgundy} fill={`${HO_COLORS.burgundy}40`} />
            <Area type="monotone" dataKey="expired" name="Expired" stroke={HO_COLORS.bronze} fill={`${HO_COLORS.bronze}40`} />
          </AreaChart>
        </ResponsiveContainer>
        {chartData.length === 0 && (
          <p className="text-xs text-ho-charcoal/50 text-center mt-2">No points activity in this range</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {expiringCards.map((card, i) => (
          <div key={i} className="bg-ho-cream border-l-4 border-ho-bronze p-4">
            <div className="text-xs font-medium text-ho-charcoal/60 uppercase tracking-wider">{card.label}</div>
            <div className="text-2xl font-light text-ho-bronze mt-1">
              {(card.data?.points || 0).toLocaleString()} <span className="text-sm">pts</span>
            </div>
            <div className="text-xs text-ho-charcoal/60 mt-1">
              across {(card.data?.users || 0).toLocaleString()} user{(card.data?.users || 0) === 1 ? '' : 's'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
