import { useState, useEffect, useCallback } from 'react'
import * as notesApi from '../api/notes'
import NoteList from '../components/notes/NoteList'
import NoteForm from '../components/notes/NoteForm'
import { HiPlus } from 'react-icons/hi2'

export default function NotesPage() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (search.trim()) params.search = search.trim()

      const result = await notesApi.getNotes(params)
      setNotes(result.items || result)
    } catch (err) {
      setError(err.message || 'Failed to load notes')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  async function handleDelete(id) {
    if (!window.confirm('Delete this note?')) return
    try {
      await notesApi.deleteNote(id)
      fetchNotes()
    } catch (err) {
      setError(err.message || 'Failed to delete note')
    }
  }

  function handleEdit(note) {
    setEditingNote(note)
    setShowForm(true)
  }

  async function handleSave(data) {
    try {
      if (editingNote) {
        await notesApi.updateNote(editingNote.id, data)
      } else {
        await notesApi.createNote(data)
      }
      setShowForm(false)
      setEditingNote(null)
      fetchNotes()
    } catch (err) {
      setError(err.message || 'Failed to save note')
    }
  }

  function handleCancelForm() {
    setShowForm(false)
    setEditingNote(null)
  }

  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Notes</h2>
        <button
          onClick={fetchNotes}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
        />
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
          <NoteForm
            note={editingNote}
            onSave={handleSave}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading notes...</p>
        </div>
      ) : (
        <NoteList
          notes={notes}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

      {!showForm && (
        <button
          onClick={() => {
            setEditingNote(null)
            setShowForm(true)
          }}
          className="fixed bottom-20 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 flex items-center justify-center text-2xl font-light transition-all active:scale-95 z-10"
          aria-label="Create new note"
        >
          <HiPlus size={24} />
        </button>
      )}
    </div>
  )
}
