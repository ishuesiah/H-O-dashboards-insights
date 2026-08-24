import { useAllStats } from '../hooks/useStats'
import StatCard from './StatCard'
import ReferralStats from './ReferralStats'
import WebhookStats from './WebhookStats'
import RecentOrdersTable from './RecentOrdersTable'

export default function Dashboard({ onLogout }) {
  const { data, error, isLoading, mutate } = useAllStats()

  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A'
    return new Date(ts).toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-ho-cream">
      {/* Header */}
      <header className="bg-ho-forest">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-light tracking-wide text-white">Hemlock & Oak Insights</h1>
            <p className="text-sm text-ho-tan mt-1">
              Last updated: {data?.timestamp ? formatTimestamp(data.timestamp) : 'Loading...'} PST
              {' '}&middot;{' '}
              <button
                onClick={() => mutate()}
                className="text-white hover:text-ho-bronze underline"
              >
                Refresh
              </button>
            </p>
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-ho-tan hover:text-white px-4 py-2 border border-ho-tan hover:border-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoading && !data && (
          <div className="text-center py-12">
            <div className="text-ho-charcoal">Loading dashboard data...</div>
          </div>
        )}

        {error && (
          <div className="bg-ho-burgundy/10 border border-ho-burgundy p-4 mb-6">
            <p className="text-ho-burgundy">Failed to load data. Please try again.</p>
          </div>
        )}

        {data && (
          <>
            {/* Referral Program Section */}
            <section className="mb-10">
              <h2 className="text-lg font-medium text-ho-charcoal mb-4 flex items-center">
                Referral Program
                <a
                  href="https://referral-web-app-k02k2.kinsta.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 text-sm font-normal text-ho-forest hover:text-ho-bronze transition-colors"
                >
                  Open Dashboard →
                </a>
              </h2>
              <ReferralStats data={data.referral} />
            </section>

            {/* Webhook Stats Section */}
            <section className="mb-10">
              <h2 className="text-lg font-medium text-ho-charcoal mb-4">Order Processing</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WebhookStats
                  title="Address Issues"
                  data={data.addressWebhook}
                  colorScheme="amber"
                  dashboardUrl="https://address-issue-webhook-bufx1.kinsta.app/"
                />
                <WebhookStats
                  title="Customizations"
                  data={data.customizationWebhook}
                  colorScheme="purple"
                  dashboardUrl="https://customization-webhook-b6ou1.kinsta.app/"
                />
              </div>
            </section>

            {/* Recent Orders Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentOrdersTable
                title="Recent Address Issues"
                orders={data.addressWebhook?.recentOrders || []}
                showTagType={true}
              />
              <RecentOrdersTable
                title="Recent Customizations"
                orders={data.customizationWebhook?.recentOrders || []}
                showTagType={true}
              />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-ho-forest mt-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 text-center text-sm text-ho-tan">
          Auto-refreshes every 30 seconds
        </div>
      </footer>
    </div>
  )
}
