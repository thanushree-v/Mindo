import { NavLink } from 'react-router-dom'
import {
  HiHome,
  HiOutlineHome,
  HiClipboardDocumentCheck,
  HiOutlineClipboardDocumentCheck,
  HiLightBulb,
  HiOutlineLightBulb,
  HiDocumentText,
  HiOutlineDocumentText,
  HiBell,
  HiOutlineBell,
} from 'react-icons/hi2'

const tabs = [
  { to: '/', label: 'Home', Icon: HiOutlineHome, ActiveIcon: HiHome },
  { to: '/tasks', label: 'Tasks', Icon: HiOutlineClipboardDocumentCheck, ActiveIcon: HiClipboardDocumentCheck },
  { to: '/ideas', label: 'Ideas', Icon: HiOutlineLightBulb, ActiveIcon: HiLightBulb },
  { to: '/notes', label: 'Notes', Icon: HiOutlineDocumentText, ActiveIcon: HiDocumentText },
  { to: '/reminders', label: 'Reminders', Icon: HiOutlineBell, ActiveIcon: HiBell },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden bg-white border-t border-gray-200 px-2 py-1 flex items-center justify-around">
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
          {({ isActive }) => {
            const IconComponent = isActive ? tab.ActiveIcon : tab.Icon
            return (
              <>
                <IconComponent size={22} className="mb-0.5" />
                <span>{tab.label}</span>
              </>
            )
          }}
        </NavLink>
      ))}
    </nav>
  )
}
