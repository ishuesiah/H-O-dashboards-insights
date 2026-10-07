import { HO_COLORS } from './ReferralInsights'

export default function RedemptionFunnel({ funnel, days }) {
  const window_ = funnel?.window || { created: 0, used: 0, cancelled: 0 }
  const outstanding = funnel?.outstanding || { codes: 0, points: 0, users: 0 }
  const created = window_.created || 0

  const stages = [
    { stage: 'Codes Created', value: created, fill: HO_COLORS.forest },
    { stage: 'Used at Checkout', value: window_.used || 0, fill: HO_COLORS.bronze },
    { stage: 'Cancelled / Refunded', value: window_.cancelled || 0, fill: HO_COLORS.burgundy }
  ]

  const outstandingCards = [
    { label: 'Outstanding Codes', value: outstanding.codes },
    { label: 'Outstanding Points', value: outstanding.points },
    { label: 'Users Holding Codes', value: outstanding.users }
  ]

  return (
    <div className="space-y-4 py-4">
      <div className="text-xs font-medium text-ho-charcoal/60 uppercase tracking-wider">
        Last {days} days
      </div>
      {stages.map((stage, i) => {
        const pct = created > 0 ? (stage.value / created) * 100 : 0
        return (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-ho-charcoal font-medium">{stage.stage}</span>
              <span className="text-ho-charcoal">{stage.value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-ho-tan h-8">
              <div
                className="h-8 transition-all flex items-center justify-end pr-3"
                style={{ width: `${Math.max(pct, 8)}%`, backgroundColor: stage.fill }}
              >
                <span className="text-white text-sm font-medium">
                  {created > 0 ? `${pct.toFixed(0)}%` : '0%'}
                </span>
              </div>
            </div>
          </div>
        )
      })}
      <p className="text-xs text-ho-charcoal/50">
        "Used" undercounts slightly — usage is only logged when the discount tier can be parsed from the code.
      </p>

      <div className="pt-2">
        <div className="text-xs font-medium text-ho-charcoal/60 uppercase tracking-wider mb-2">
          All-time outstanding (unused codes)
        </div>
        <div className="grid grid-cols-3 gap-4">
          {outstandingCards.map((card, i) => (
            <div key={i} className="bg-ho-cream border-l-4 border-ho-forest p-4 flex flex-col items-center justify-center">
              <div className="text-2xl font-light text-ho-forest">{(card.value || 0).toLocaleString()}</div>
              <div className="text-xs text-ho-charcoal/60 mt-1 text-center">{card.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
