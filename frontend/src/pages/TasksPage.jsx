import { useState, useEffect, useCallback } from 'react'
import * as tasksApi from '../api/tasks'
import TaskList from '../components/tasks/TaskList'
import TaskForm from '../components/tasks/TaskForm'
import { HiPlus } from 'react-icons/hi2'

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'all', label: 'All' },
]

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [search, setSearch] = useState('')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (activeTab === 'pending') params.status = 'pending'
      if (activeTab === 'completed') params.status = 'completed'
      if (search.trim()) params.search = search.trim()

      const result = await tasksApi.getTasks(params)
      setTasks(result.items || result)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [activeTab, search])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  async function handleComplete(id) {
    try {
      await tasksApi.completeTask(id)
      fetchTasks()
    } catch (err) {
      setError(err.message || 'Failed to complete task')
    }
  }

  async function handlePostpone(id, newDueAt) {
    try {
      await tasksApi.postponeTask(id, new Date(newDueAt).toISOString())
      fetchTasks()
    } catch (err) {
      setError(err.message || 'Failed to postpone task')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return
    try {
      await tasksApi.deleteTask(id)
      fetchTasks()
    } catch (err) {
      setError(err.message || 'Failed to delete task')
    }
  }

  function handleEdit(task) {
    setEditingTask(task)
    setShowForm(true)
  }

  async function handleSave(data) {
    try {
      if (editingTask) {
        await tasksApi.updateTask(editingTask.id, data)
      } else {
        await tasksApi.createTask(data)
      }
      setShowForm(false)
      setEditingTask(null)
      fetchTasks()
    } catch (err) {
      setError(err.message || 'Failed to save task')
    }
  }

  function handleCancelForm() {
    setShowForm(false)
    setEditingTask(null)
  }

  return (
    <div className="pt-4 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Tasks</h2>
        <button
          onClick={fetchTasks}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
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
          <TaskForm
            task={editingTask}
            onSave={handleSave}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading tasks...</p>
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onComplete={handleComplete}
          onPostpone={handlePostpone}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

      {!showForm && (
        <button
          onClick={() => {
            setEditingTask(null)
            setShowForm(true)
          }}
          className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 flex items-center justify-center text-2xl font-light transition-all active:scale-95 z-10"
          aria-label="Create new task"
        >
          <HiPlus size={24} />
        </button>
      )}
    </div>
  )
}
