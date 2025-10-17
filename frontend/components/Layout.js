import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  return (
    <div className="min-h-screen bg-background animated-bg">
      {user && (
        <header className="glass border-b border-primary/10 sticky top-0 z-50 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => router.push('/movies')}
            >
              <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M26 10L14 17L2 10M26 20L14 27L2 20M26 10V20M2 10V20M14 3L26 10M14 3L2 10" stroke="#2BD17E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="text-white text-2xl font-bold group-hover:text-primary transition-colors">
                My Movies
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-background-input/50 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {user.email?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-300">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors
                  px-4 py-2 rounded-lg hover:bg-background-input/30"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>
      )}
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

