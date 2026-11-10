import { formatDateTime } from '../../utils/dates'

const STATUS_STYLES = {
  pending: 'bg-indigo-100 text-indigo-700',
  scheduled: 'bg-indigo-100 text-indigo-700',
  sent: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

export default function ReminderCard({ reminder, onCancel }) {
  const canCancel = reminder.status === 'pending' || reminder.status === 'scheduled'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800">
            {reminder.title}
          </h3>
          {reminder.message && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {reminder.message}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {reminder.scheduled_at && (
              <span className="text-xs text-gray-500">
                {formatDateTime(reminder.scheduled_at)}
              </span>
            )}
            {reminder.status && (
              <span
                className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  STATUS_STYLES[reminder.status] || STATUS_STYLES.pending
                }`}
              >
                {reminder.status}
              </span>
            )}
          </div>
        </div>
        {canCancel && (
          <button
            onClick={() => onCancel(reminder.id)}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            title="Cancel reminder"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
