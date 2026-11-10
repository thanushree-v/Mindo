import { useState, useEffect, useCallback } from 'react'
import * as remindersApi from '../api/reminders'
import ReminderCard from '../components/reminders/ReminderCard'
import ReminderForm from '../components/reminders/ReminderForm'
import { HiOutlineBell, HiPlus } from 'react-icons/hi2'

export default function RemindersPage() {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const fetchReminders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await remindersApi.getReminders()
      setReminders(result.items || result)
    } catch (err) {
      setError(err.message || 'Failed to load reminders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReminders()
  }, [fetchReminders])

  async function handleCancel(id) {
    if (!window.confirm('Cancel this reminder?')) return
    try {
      await remindersApi.cancelReminder(id)
      fetchReminders()
    } catch (err) {
      setError(err.message || 'Failed to cancel reminder')
    }
  }

  async function handleSave(data) {
    try {
      await remindersApi.createReminder(data)
      setShowForm(false)
      fetchReminders()
    } catch (err) {
      setError(err.message || 'Failed to create reminder')
    }
  }

  function handleCancelForm() {
    setShowForm(false)
  }

  const upcoming = reminders.filter(
    (r) => r.status === 'pending' || r.status === 'scheduled'
  )
  const past = reminders.filter(
    (r) => r.status === 'sent' || r.status === 'failed' || r.status === 'cancelled'
  )

  return (
    <div className="pt-4 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Reminders</h2>
        <button
          onClick={fetchReminders}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
          <p className="text-sm text-rose-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs text-rose-600 underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {showForm && (
        <div className="mb-4">
          <ReminderForm
            onSave={handleSave}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading reminders...</p>
        </div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-12">
          <HiOutlineBell className="mx-auto text-gray-300" size={48} />
          <p className="text-gray-500 font-medium mt-3">No reminders scheduled</p>
          <p className="text-gray-400 text-sm mt-1">
            Create a reminder to stay on track!
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Upcoming
            </h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">
                No upcoming reminders
              </p>
            ) : (
              <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
                {upcoming.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            )}
          </div>

          {past.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                Past
              </h3>
              <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3 opacity-70">
                {past.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 flex items-center justify-center text-2xl font-light transition-all active:scale-95 z-10"
          aria-label="Create new reminder"
        >
          <HiPlus size={24} />
        </button>
      )}
    </div>
  )
}
