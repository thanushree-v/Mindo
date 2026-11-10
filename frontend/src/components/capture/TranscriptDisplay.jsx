import { useState } from 'react'

export default function TranscriptDisplay({ transcript, onTranscriptChange, editable = true }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(transcript)

  function handleEdit() {
    setEditValue(transcript)
    setIsEditing(true)
  }

  function handleSave() {
    if (onTranscriptChange) {
      onTranscriptChange(editValue)
    }
    setIsEditing(false)
  }

  function handleCancel() {
    setEditValue(transcript)
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Transcript</h3>
        {editable && !isEditing && (
          <button
            onClick={handleEdit}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none min-h-[100px]"
            rows={4}
          />
          <div className="flex gap-2 mt-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Save edits
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
          {transcript || 'No transcript available'}
        </p>
      )}
    </div>
  )
}
