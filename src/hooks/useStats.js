import useSWR from 'swr'

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) {
    const error = new Error('Failed to fetch')
    error.status = res.status
    throw error
  }
  return res.json()
}

export function useAllStats() {
  return useSWR('/api/stats/all', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
    errorRetryCount: 3
  })
}

export function useTrendPeople(enabled) {
  return useSWR(enabled ? '/api/stats/trend-people' : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    errorRetryCount: 2
  })
}

export function useAuthCheck() {
  return useSWR('/api/auth/check', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  })
}
