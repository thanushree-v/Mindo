import { useState } from 'react'

export default function NoteForm({ note, onSave, onCancel }) {
  const [content, setContent] = useState(note?.content || '')
  const [error, setError] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) {
      setError('Content is required')
      return
    }

    onSave({ content: content.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {note ? 'Edit Note' : 'New Note'}
      </h3>

      {error && (
        <div className="mb-3 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-xs text-gray-500 mb-1 font-medium">
          Content *
        </label>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            setError(null)
          }}
          placeholder="Write your note..."
          rows={5}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
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
          {note ? 'Save Changes' : 'Create Note'}
        </button>
      </div>
    </form>
  )
}
