import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/movies')
    }
  }, [user, router])

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const newErrors = {}
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (!result.success) {
      setErrors({ general: result.error })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-16">
          <h1 className="text-white text-5xl md:text-6xl font-semibold mb-4">
            Sign in
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-background-input text-white px-4 py-3 rounded-xl 
                placeholder-gray-400 focus:outline-none focus:ring-2 border border-transparent
                ${errors.email ? 'ring-2 ring-error border-error' : 'focus:ring-primary focus:border-primary'}`}
            />
            {errors.email && (
              <p className="text-error text-sm mt-2 flex items-center gap-1">
                <span>⚠️</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-background-input text-white px-4 py-3 rounded-xl 
                placeholder-gray-400 focus:outline-none focus:ring-2 border border-transparent
                ${errors.password ? 'ring-2 ring-error border-error' : 'focus:ring-primary focus:border-primary'}`}
            />
            {errors.password && (
              <p className="text-error text-sm mt-2 flex items-center gap-1">
                <span>⚠️</span> {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                id="remember"
                className="w-5 h-5 rounded bg-background-input border-2 border-gray-600 
                  text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 
                  transition-all cursor-pointer"
              />
              <span className="ml-3 text-gray-300 group-hover:text-white transition-colors">
                Remember me
              </span>
            </label>
            <button type="button" className="text-primary hover:text-primary/80 text-sm transition-colors">
              Forgot password?
            </button>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="bg-error/20 border-2 border-error rounded-xl p-4 backdrop-blur-sm">
              <p className="text-error font-medium flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 13C9.45 13 9 12.55 9 12C9 11.45 9.45 11 10 11C10.55 11 11 11.45 11 12C11 12.55 10.55 13 10 13ZM11 9C11 9.55 10.55 10 10 10C9.45 10 9 9.55 9 9V7C9 6.45 9.45 6 10 6C10.55 6 11 6.45 11 7V9Z"/>
                </svg>
                {errors.general}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 
              hover:to-primary/70 text-white font-bold py-4 rounded-xl transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed btn-primary shadow-lg 
              hover:shadow-primary/50 relative overflow-hidden"
          >
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </span>
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-primary hover:text-primary/80 font-semibold transition-colors 
                hover:underline decoration-2 underline-offset-4"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

