export default function WebhookStats({ title, data, colorScheme = 'forest', dashboardUrl }) {
  if (data?.error) {
    return (
      <div className="bg-white shadow-sm p-6">
        <h3 className="text-sm font-medium text-ho-charcoal mb-4">{title}</h3>
        <div className="bg-ho-burgundy/10 border border-ho-burgundy p-3">
          <p className="text-ho-burgundy text-sm">Failed to load: {data.error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-white shadow-sm p-6">
        <h3 className="text-sm font-medium text-ho-charcoal mb-4">{title}</h3>
        <p className="text-ho-charcoal/60 text-sm">No data available</p>
      </div>
    )
  }

  const colors = {
    amber: {
      pending: 'bg-ho-bronze/20 text-ho-bronze',
      completed: 'bg-ho-forest/20 text-ho-forest',
      failed: 'bg-ho-burgundy/20 text-ho-burgundy',
      accent: 'text-ho-bronze'
    },
    purple: {
      pending: 'bg-ho-burgundy/20 text-ho-burgundy',
      completed: 'bg-ho-forest/20 text-ho-forest',
      failed: 'bg-ho-burgundy/20 text-ho-burgundy',
      accent: 'text-ho-burgundy'
    },
    forest: {
      pending: 'bg-ho-tan text-ho-charcoal',
      completed: 'bg-ho-forest/20 text-ho-forest',
      failed: 'bg-ho-burgundy/20 text-ho-burgundy',
      accent: 'text-ho-forest'
    }
  }

  const colorSet = colors[colorScheme] || colors.forest

  // Handle different data structures
  const stats = data.stats || {}
  const byTagType = data.byTagType || data.stats // For address webhook, stats is already by tag type

  // For address webhook: stats is { preorder: {...}, address_issue: {...}, address_confirmed: {...} }
  // For customization webhook: stats is { pending: 0, completed: 0, failed: 0 }, byTagType is { charm: {...}, customization: {...} }

  const isAddressWebhook = stats.preorder !== undefined
  const isCustomizationWebhook = stats.pending !== undefined && data.byTagType !== undefined

  return (
    <div className="bg-white shadow-sm p-6">
      <h3 className="text-sm font-medium text-ho-charcoal mb-4">
        {title}
        {dashboardUrl && (
          <a
            href={dashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-xs font-normal text-ho-forest hover:text-ho-bronze transition-colors"
          >
            Open →
          </a>
        )}
      </h3>

      {isAddressWebhook && (
        <div className="space-y-4">
          {/* Pre-orders */}
          <div>
            <div className="text-xs text-ho-charcoal/60 uppercase tracking-wider mb-2">Pre-orders</div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.pending}`}>
                {stats.preorder?.pending || 0} pending
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.completed}`}>
                {stats.preorder?.completed || 0} completed
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.failed}`}>
                {stats.preorder?.failed || 0} failed
              </span>
            </div>
          </div>

          {/* Address Issues */}
          <div>
            <div className="text-xs text-ho-charcoal/60 uppercase tracking-wider mb-2">Address Issues</div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.pending}`}>
                {stats.address_issue?.pending || 0} pending
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.completed}`}>
                {stats.address_issue?.completed || 0} completed
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.failed}`}>
                {stats.address_issue?.failed || 0} failed
              </span>
            </div>
          </div>

          {/* Address Confirmed */}
          <div>
            <div className="text-xs text-ho-charcoal/60 uppercase tracking-wider mb-2">Address Confirmed</div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.pending}`}>
                {stats.address_confirmed?.pending || 0} pending
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.completed}`}>
                {stats.address_confirmed?.completed || 0} completed
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.failed}`}>
                {stats.address_confirmed?.failed || 0} failed
              </span>
            </div>
          </div>
        </div>
      )}

      {isCustomizationWebhook && (
        <div className="space-y-4">
          {/* Overall Stats */}
          <div>
            <div className="text-xs text-ho-charcoal/60 uppercase tracking-wider mb-2">Overall</div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.pending}`}>
                {stats.pending || 0} pending
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.completed}`}>
                {stats.completed || 0} completed
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.failed}`}>
                {stats.failed || 0} failed
              </span>
            </div>
          </div>

          {/* By Tag Type */}
          <div>
            <div className="text-xs text-ho-charcoal/60 uppercase tracking-wider mb-2">Charms</div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.pending}`}>
                {byTagType.charm?.pending || 0} pending
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.completed}`}>
                {byTagType.charm?.completed || 0} completed
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs text-ho-charcoal/60 uppercase tracking-wider mb-2">Customizations</div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.pending}`}>
                {byTagType.customization?.pending || 0} pending
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${colorSet.completed}`}>
                {byTagType.customization?.completed || 0} completed
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
