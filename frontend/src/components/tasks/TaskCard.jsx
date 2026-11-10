import { useState } from 'react'
import { relativeDate } from '../../utils/dates'
import {
  HiOutlineCheck,
  HiOutlineCalendar,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiChevronUp,
  HiChevronDown,
} from 'react-icons/hi2'

const PRIORITY_STYLES = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

export default function TaskCard({ task, onComplete, onPostpone, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false)
  const [showPostpone, setShowPostpone] = useState(false)
  const [postponeDate, setPostponeDate] = useState('')

  const isOverdue =
    task.due_at && !task.completed_at && new Date(task.due_at) < new Date()

  function handlePostpone() {
    if (postponeDate) {
      onPostpone(task.id, postponeDate)
      setShowPostpone(false)
      setPostponeDate('')
    }
  }

  const dueDateDisplay = task.due_at ? relativeDate(task.due_at) : null

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
        task.completed_at ? 'border-gray-100 opacity-60' : 'border-gray-100'
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-semibold ${
                task.completed_at ? 'text-gray-400 line-through' : 'text-gray-800'
              }`}
            >
              {task.title}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {dueDateDisplay && (
                <span
                  className={`text-xs font-medium ${
                    isOverdue ? 'text-red-600' : 'text-gray-500'
                  }`}
                >
                  {isOverdue ? `Overdue: ${dueDateDisplay}` : dueDateDisplay}
                </span>
              )}
              {task.priority && (
                <span
                  className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium
                  }`}
                >
                  {task.priority}
                </span>
              )}
              {task.category && (
                <span className="inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {task.category}
                </span>
              )}
              {task.completed_at && (
                <span className="inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Completed
                </span>
              )}
            </div>
          </div>
          <span className="text-gray-300 shrink-0">
            {expanded ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3">
          {task.description && (
            <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">
              {task.description}
            </p>
          )}

          {showPostpone && (
            <div className="mb-3 flex items-center gap-2 flex-wrap">
              <input
                type="datetime-local"
                value={postponeDate}
                onChange={(e) => setPostponeDate(e.target.value)}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <button
                onClick={handlePostpone}
                disabled={!postponeDate}
                className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
              >
                Set
              </button>
              <button
                onClick={() => setShowPostpone(false)}
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {!task.completed_at && (
              <button
                onClick={() => onComplete(task.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                title="Complete"
              >
                <HiOutlineCheck size={14} /> Complete
              </button>
            )}
            {!task.completed_at && (
              <button
                onClick={() => setShowPostpone(!showPostpone)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                title="Postpone"
              >
                <HiOutlineCalendar size={14} /> Postpone
              </button>
            )}
            <button
              onClick={() => onEdit(task)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              title="Edit"
            >
              <HiOutlinePencilSquare size={14} /> Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              title="Delete"
            >
              <HiOutlineTrash size={14} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
