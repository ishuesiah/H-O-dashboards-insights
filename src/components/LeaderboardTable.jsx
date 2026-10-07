export default function LeaderboardTable({ leaderboard }) {
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center">
        <p className="text-sm text-ho-charcoal/50">No referrers yet</p>
      </div>
    )
  }

  return (
    <div className="border border-ho-tan">
      <div className="px-4 py-2 bg-ho-cream border-b border-ho-tan">
        <span className="text-xs font-medium text-ho-charcoal/60 uppercase tracking-wider">
          Top Referrers — All Time
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-ho-charcoal/60 uppercase tracking-wider border-b border-ho-tan/50">
              <th className="px-4 py-2 font-medium">#</th>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium text-right">Referrals</th>
              <th className="px-4 py-2 font-medium text-right">Purchases</th>
              <th className="px-4 py-2 font-medium text-right">Points</th>
              <th className="px-4 py-2 font-medium">Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ho-tan/50">
            {leaderboard.map((person, i) => (
              <tr key={i} className="text-ho-charcoal hover:bg-ho-cream/50">
                <td className="px-4 py-2 text-ho-charcoal/50">{i + 1}</td>
                <td className="px-4 py-2 font-medium">
                  {`${person.firstName || ''} ${person.lastName || ''}`.trim() || 'Unknown'}
                </td>
                <td className="px-4 py-2 text-ho-charcoal/60">{person.email}</td>
                <td className="px-4 py-2 text-right font-medium text-ho-forest">
                  {(person.referralCount || 0).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right">{(person.referralPurchases || 0).toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{(person.points || 0).toLocaleString()}</td>
                <td className="px-4 py-2">{person.tier || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
