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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hemlock & Oak Insights</h1>
            <p className="text-sm text-gray-500">
              Last updated: {data?.timestamp ? formatTimestamp(data.timestamp) : 'Loading...'} PST
              {' '}&middot;{' '}
              <button
                onClick={() => mutate()}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Refresh
              </button>
            </p>
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoading && !data && (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading dashboard data...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">Failed to load data. Please try again.</p>
          </div>
        )}

        {data && (
          <>
            {/* Referral Program Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Referral Program
                <a
                  href="https://referral-program-448vr.kinsta.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-sm font-normal text-indigo-600 hover:text-indigo-800"
                >
                  Open Dashboard →
                </a>
              </h2>
              <ReferralStats data={data.referral} />
            </section>

            {/* Webhook Stats Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Processing</h2>
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
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          Auto-refreshes every 30 seconds
        </div>
      </footer>
    </div>
  )
}
