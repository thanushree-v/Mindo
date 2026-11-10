import { useState } from 'react'
import { relativeDate } from '../../utils/dates'
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineArrowRightCircle,
  HiChevronUp,
  HiChevronDown,
} from 'react-icons/hi2'

export default function IdeaCard({ idea, onDelete, onEdit, onConvert }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-800">
              {idea.title}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {idea.created_at && (
                <span className="text-xs text-gray-500">
                  {relativeDate(idea.created_at)}
                </span>
              )}
            </div>
            {!expanded && idea.description && (
              <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                {idea.description}
              </p>
            )}
          </div>
          <span className="text-gray-300 shrink-0">
            {expanded ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3">
          {idea.description && (
            <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">
              {idea.description}
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => onConvert(idea.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 border border-indigo-300 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              title="Convert to Task"
            >
              <HiOutlineArrowRightCircle size={14} /> Convert to Task
            </button>
            <button
              onClick={() => onEdit(idea)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              title="Edit"
            >
              <HiOutlinePencilSquare size={14} /> Edit
            </button>
            <button
              onClick={() => onDelete(idea.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors ml-auto"
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
