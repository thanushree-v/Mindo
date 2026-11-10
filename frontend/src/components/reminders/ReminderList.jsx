import ReminderCard from './ReminderCard'
import { HiOutlineBell } from 'react-icons/hi2'

export default function ReminderList({ reminders, onCancel }) {
  if (!reminders || reminders.length === 0) {
    return (
      <div className="text-center py-12">
        <HiOutlineBell className="mx-auto text-gray-300" size={48} />
        <p className="text-gray-500 font-medium mt-3">No reminders scheduled</p>
        <p className="text-gray-400 text-sm mt-1">
          Create a reminder to stay on track!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
      {reminders.map((reminder) => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          onCancel={onCancel}
        />
      ))}
    </div>
  )
}
