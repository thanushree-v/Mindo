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

const links = [
  { to: '/', label: 'Home', Icon: HiOutlineHome, ActiveIcon: HiHome },
  { to: '/tasks', label: 'Tasks', Icon: HiOutlineClipboardDocumentCheck, ActiveIcon: HiClipboardDocumentCheck },
  { to: '/ideas', label: 'Ideas', Icon: HiOutlineLightBulb, ActiveIcon: HiLightBulb },
  { to: '/notes', label: 'Notes', Icon: HiOutlineDocumentText, ActiveIcon: HiDocumentText },
  { to: '/reminders', label: 'Reminders', Icon: HiOutlineBell, ActiveIcon: HiBell },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 lg:w-64 bg-white border-r border-gray-200 py-6 px-3 shrink-0">
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => {
              const IconComponent = isActive ? link.ActiveIcon : link.Icon
              return (
                <>
                  <IconComponent size={20} />
                  <span>{link.label}</span>
                </>
              )
            }}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
