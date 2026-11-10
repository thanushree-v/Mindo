import ReminderCard from './ReminderCard'

export default function ReminderList({ reminders, onCancel }) {
  if (!reminders || reminders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">{'⏰'}</p>
        <p className="text-gray-500 font-medium">No reminders scheduled</p>
        <p className="text-gray-400 text-sm mt-1">
          Create a reminder to stay on track!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
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
