import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/tasks', label: 'Tasks', icon: '✅' },
  { to: '/ideas', label: 'Ideas', icon: '💡' },
  { to: '/notes', label: 'Notes', icon: '📝' },
  { to: '/reminders', label: 'Reminders', icon: '⏰' },
]

export default function BottomNav() {
  return (
    <nav className="bg-white border-t border-gray-200 px-2 py-1 flex items-center justify-around">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-3 text-xs transition-colors ${
              isActive
                ? 'text-indigo-600 font-semibold'
                : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <span className="text-xl mb-0.5">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
