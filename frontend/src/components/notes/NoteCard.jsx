import { useState } from 'react'
import { relativeDate } from '../../utils/dates'

export default function NoteCard({ note, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false)

  const displayText = note.content || ''
  const isLong = displayText.length > 150

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className={`text-sm text-gray-800 ${!expanded && isLong ? 'line-clamp-3' : 'whitespace-pre-wrap'}`}>
              {displayText}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              {note.created_at && (
                <span className="text-xs text-gray-500">
                  {relativeDate(note.created_at)}
                </span>
              )}
            </div>
          </div>
          {isLong && (
            <span className="text-gray-300 text-sm shrink-0">
              {expanded ? '▲' : '▼'}
            </span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(note)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              title="Edit"
            >
              <span>{'✏️'}</span> Edit
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors ml-auto"
              title="Delete"
            >
              <span>{'🗑'}</span> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
