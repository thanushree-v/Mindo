import { useAuth } from '../../hooks/useAuth'
import NotificationBell from '../notifications/NotificationBell'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-600 tracking-tight">MINDDO</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user?.name}</span>
          <NotificationBell />
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
