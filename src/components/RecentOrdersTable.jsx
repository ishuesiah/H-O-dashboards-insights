export default function RecentOrdersTable({ title, orders = [], showTagType = false }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-ho-forest/20 text-ho-forest'
      case 'pending': return 'bg-ho-tan text-ho-charcoal'
      case 'failed': return 'bg-ho-burgundy/20 text-ho-burgundy'
      default: return 'bg-ho-tan/50 text-ho-charcoal'
    }
  }

  const getTagTypeColor = (tagType) => {
    switch (tagType) {
      case 'preorder': return 'bg-ho-forest/20 text-ho-forest'
      case 'address_issue': return 'bg-ho-bronze/20 text-ho-bronze'
      case 'address_confirmed': return 'bg-ho-forest/20 text-ho-forest'
      case 'charm': return 'bg-ho-burgundy/20 text-ho-burgundy'
      case 'customization': return 'bg-ho-bronze/20 text-ho-bronze'
      default: return 'bg-ho-tan/50 text-ho-charcoal'
    }
  }

  return (
    <div className="bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-ho-tan">
        <h3 className="text-sm font-medium text-ho-charcoal">{title}</h3>
      </div>

      {orders.length === 0 ? (
        <div className="px-6 py-8 text-center text-ho-charcoal/60 text-sm">
          No recent orders
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-ho-tan">
            <thead className="bg-ho-cream">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-ho-charcoal/60 uppercase tracking-wider">
                  Order
                </th>
                {showTagType && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-ho-charcoal/60 uppercase tracking-wider">
                    Type
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-ho-charcoal/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-ho-charcoal/60 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-ho-tan/50">
              {orders.slice(0, 10).map((order, idx) => (
                <tr key={idx} className="hover:bg-ho-cream/50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-ho-charcoal">
                    #{order.orderNumber}
                  </td>
                  {showTagType && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs font-medium ${getTagTypeColor(order.tagType)}`}>
                        {order.tagType?.replace(/_/g, ' ')}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-ho-charcoal/60">
                    {formatTime(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
