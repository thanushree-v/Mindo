import { useState } from 'react'

const TYPE_STYLES = {
  task: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Task' },
  idea: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Idea' },
  note: { bg: 'bg-green-100', text: 'text-green-700', label: 'Note' },
  reminder: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Reminder' },
}

const PRIORITIES = ['low', 'medium', 'high']
const CATEGORIES = ['personal', 'work', 'study', 'other']

export default function ExtractionCard({ item, onChange, included, onToggle }) {
  const [showDescription, setShowDescription] = useState(false)
  const typeStyle = TYPE_STYLES[item.type] || TYPE_STYLES.note

  function handleChange(field, value) {
    onChange({ ...item, [field]: value })
  }

  const isTask = item.type === 'task'
  const isReminder = item.type === 'reminder'
  const showDatePicker = isTask || isReminder

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border p-4 transition-opacity ${
        included ? 'border-gray-100 opacity-100' : 'border-gray-200 opacity-50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}
          >
            {typeStyle.label}
          </span>
          {item.needs_clarification && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
              Needs clarification
            </span>
          )}
        </div>
        <label className="flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={included}
            onChange={onToggle}
            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
          <span className="ml-1.5 text-xs text-gray-500">Include</span>
        </label>
      </div>

      <div className="mt-3">
        <input
          type="text"
          value={item.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Title"
          className="w-full text-sm font-semibold text-gray-800 border-b border-gray-100 pb-1 focus:outline-none focus:border-indigo-400 bg-transparent"
        />
      </div>

      <div className="mt-2">
        <button
          onClick={() => setShowDescription(!showDescription)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          {showDescription ? 'Hide description' : 'Show description'}
        </button>
        {showDescription && (
          <textarea
            value={item.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="mt-1 w-full text-sm text-gray-600 border border-gray-100 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none"
          />
        )}
      </div>

      {showDatePicker && (
        <div className="mt-3">
          <label className="block text-xs text-gray-500 mb-1">
            {isReminder ? 'Remind at' : 'Due date'}
          </label>
          <input
            type="datetime-local"
            value={item.due_at || item.reminder_at || ''}
            onChange={(e) =>
              handleChange(isReminder ? 'reminder_at' : 'due_at', e.target.value)
            }
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
      )}

      {isTask && (
        <div className="mt-3 flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Priority</label>
            <select
              value={item.priority || 'medium'}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <select
              value={item.category || 'personal'}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
