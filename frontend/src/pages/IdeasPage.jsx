import { useState, useEffect, useCallback } from 'react'
import * as ideasApi from '../api/ideas'
import IdeaList from '../components/ideas/IdeaList'
import IdeaForm from '../components/ideas/IdeaForm'

export default function IdeasPage() {
  const [search, setSearch] = useState('')
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingIdea, setEditingIdea] = useState(null)

  const fetchIdeas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (search.trim()) params.search = search.trim()

      const result = await ideasApi.getIdeas(params)
      setIdeas(result.items || result)
    } catch (err) {
      setError(err.message || 'Failed to load ideas')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchIdeas()
  }, [fetchIdeas])

  async function handleDelete(id) {
    if (!window.confirm('Delete this idea?')) return
    try {
      await ideasApi.deleteIdea(id)
      fetchIdeas()
    } catch (err) {
      setError(err.message || 'Failed to delete idea')
    }
  }

  function handleEdit(idea) {
    setEditingIdea(idea)
    setShowForm(true)
  }

  async function handleConvert(id) {
    try {
      await ideasApi.convertIdeaToTask(id)
      setError(null)
      fetchIdeas()
    } catch (err) {
      setError(err.message || 'Failed to convert idea to task')
    }
  }

  async function handleSave(data) {
    try {
      if (editingIdea) {
        await ideasApi.updateIdea(editingIdea.id, data)
      } else {
        await ideasApi.createIdea(data)
      }
      setShowForm(false)
      setEditingIdea(null)
      fetchIdeas()
    } catch (err) {
      setError(err.message || 'Failed to save idea')
    }
  }

  function handleCancelForm() {
    setShowForm(false)
    setEditingIdea(null)
  }

  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Ideas</h2>
        <button
          onClick={fetchIdeas}
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
          placeholder="Search ideas..."
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
          <IdeaForm
            idea={editingIdea}
            onSave={handleSave}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading ideas...</p>
        </div>
      ) : (
        <IdeaList
          ideas={ideas}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onConvert={handleConvert}
        />
      )}

      {!showForm && (
        <button
          onClick={() => {
            setEditingIdea(null)
            setShowForm(true)
          }}
          className="fixed bottom-20 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 flex items-center justify-center text-2xl font-light transition-all active:scale-95 z-10"
          aria-label="Create new idea"
        >
          +
        </button>
      )}
    </div>
  )
}
