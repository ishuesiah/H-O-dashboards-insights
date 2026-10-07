import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from 'recharts'
import { HO_COLORS } from './ReferralInsights'

export default function FraudDetail({ fraudDetail }) {
  const { byStatus, byCheck, oldestPendingDays } = fraudDetail || {}

  if (!byStatus) {
    return (
      <div className="h-72 flex items-center justify-center">
        <p className="text-sm text-ho-charcoal/50">No fraud flags recorded yet</p>
      </div>
    )
  }

  const pending = byStatus.pending || 0
  const statusCards = [
    { label: 'Pending Review', value: pending, highlight: pending > 0 },
    { label: 'Confirmed', value: byStatus.confirmed || 0 },
    { label: 'Dismissed', value: byStatus.dismissed || 0 },
    { label: 'Total Flags', value: byStatus.total || 0 }
  ]

  const checkData = (byCheck || []).map(c => ({
    name: c.check.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count: c.count
  }))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statusCards.map((card, i) => (
          <div
            key={i}
            className={`bg-ho-cream border-l-4 p-4 ${card.highlight ? 'border-ho-burgundy' : 'border-ho-forest'}`}
          >
            <div className={`text-2xl font-light ${card.highlight ? 'text-ho-burgundy' : 'text-ho-forest'}`}>
              {card.value.toLocaleString()}
            </div>
            <div className="text-xs text-ho-charcoal/60 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {checkData.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={checkData} layout="vertical" margin={{ left: 120 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" name="Flags" fill={HO_COLORS.burgundy} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <p className="text-xs text-ho-charcoal/50">
        A single flagged user can trip multiple checks, so check counts can exceed total flags.
      </p>

      {oldestPendingDays !== null && oldestPendingDays !== undefined && (
        <div className="p-3 bg-ho-burgundy/10 border-l-4 border-ho-burgundy">
          <p className="text-sm text-ho-charcoal">
            <strong>Oldest pending flag:</strong> {oldestPendingDays} day{oldestPendingDays === 1 ? '' : 's'} old
          </p>
        </div>
      )}
    </div>
  )
}
