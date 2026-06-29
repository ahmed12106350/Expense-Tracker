import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const response = await api.post('/auth/login', { email, password })
            onLogin(response.data.token)
            navigate('/dashboard', { replace: true })
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">

                {/* Brand */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-lg">
                        💰
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="off"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder=""
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                            >
                                {showPassword ? (
                                    // Eye with slash — hide password
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    // Eye — show password
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl transition shadow-md mt-2"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    No account?{' '}
                    <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage