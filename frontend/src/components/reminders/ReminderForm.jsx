import { useState } from 'react'

export default function ReminderForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    message: '',
    scheduled_at: '',
  })
  const [error, setError] = useState(null)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    if (!form.scheduled_at) {
      setError('Scheduled time is required')
      return
    }

    const data = {
      title: form.title.trim(),
      message: form.message.trim() || undefined,
      scheduled_at: new Date(form.scheduled_at).toISOString(),
    }

    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        New Reminder
      </h3>

      {error && (
        <div className="mb-3 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Remind me to..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">
            Message
          </label>
          <textarea
            value={form.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="Additional details..."
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">
            Scheduled time *
          </label>
          <input
            type="datetime-local"
            value={form.scheduled_at}
            onChange={(e) => handleChange('scheduled_at', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Create Reminder
        </button>
      </div>
    </form>
  )
}
