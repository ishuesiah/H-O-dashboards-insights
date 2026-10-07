const ERROR_MESSAGES = {
  not_configured:
    "Google sign-in isn't configured on this server yet. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
  denied: 'Sign-in was cancelled. Try again.',
  state: 'Sign-in expired or was invalid. Try again.',
  exchange: 'Could not complete sign-in with Google. Try again.',
  token: 'Google returned an invalid sign-in token. Try again.',
  domain: 'That Google account is not allowed. Use your @hemlockandoak.com account.',
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

export default function LoginForm() {
  const params = new URLSearchParams(window.location.search)
  const error = params.get('auth_error')
  const errorMessage = error ? ERROR_MESSAGES[error] || 'Sign-in failed. Try again.' : ''

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Hemlock & Oak</h1>
          <p className="text-gray-500 mt-2">Insights Dashboard</p>
        </div>

        <p className="text-sm text-gray-600 text-center mb-6">
          Sign in with your @hemlockandoak.com Google account to view the dashboard.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        <a
          href="/api/auth/google-login"
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium"
        >
          <GoogleLogo />
          Sign in with Google
        </a>
      </div>
    </div>
  )
}
