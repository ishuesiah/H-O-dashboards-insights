import { useState, useEffect } from 'react'
import { useAuthCheck } from './hooks/useStats'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'

function App() {
  const { data: authData, isLoading, mutate } = useAuthCheck()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (authData?.authenticated) {
      setIsAuthenticated(true)
    }
  }, [authData])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    mutate()
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    setIsAuthenticated(false)
    mutate()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onSuccess={handleLoginSuccess} />
  }

  return <Dashboard onLogout={handleLogout} />
}

export default App
