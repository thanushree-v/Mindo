import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { extractFromTranscript } from '../api/extractions'
import { createTask } from '../api/tasks'
import { createIdea } from '../api/ideas'
import { createNote } from '../api/notes'
import { createReminder } from '../api/reminders'
import useTTS from '../hooks/useTTS'
import TranscriptDisplay from '../components/capture/TranscriptDisplay'
import ExtractionPreview from '../components/extraction/ExtractionPreview'
import { HiCheck, HiChevronDown, HiChevronRight } from 'react-icons/hi2'

export default function CaptureReviewPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const { speak } = useTTS()
  const { transcript: initialTranscript, captureId } = location.state || {}

  const [transcript, setTranscript] = useState(initialTranscript || '')
  const [extractedItems, setExtractedItems] = useState(null)
  const [loading, setLoading] = useState(true)
  const [extractionError, setExtractionError] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmResult, setConfirmResult] = useState(null)
  const [showTranscript, setShowTranscript] = useState(false)

  useEffect(() => {
    if (!transcript) {
      navigate('/', { replace: true })
      return
    }
    runExtraction()
  }, [])

  async function runExtraction() {
    setLoading(true)
    setExtractionError(null)
    try {
      const result = await extractFromTranscript({
        transcript,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      setExtractedItems(result.items || result)
    } catch (err) {
      setExtractionError(err.message || 'Failed to extract items')
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm(confirmedItems) {
    setConfirming(true)
    const results = { success: 0, failed: 0 }

    for (const item of confirmedItems) {
      try {
        if (item.type === 'task') {
          await createTask({
            title: item.title,
            description: item.description || undefined,
            due_at: item.due_at ? new Date(item.due_at).toISOString() : undefined,
            priority: item.priority || 'medium',
            category: item.category || 'personal',
          })
          results.success++
        } else if (item.type === 'idea') {
          await createIdea({
            title: item.title,
            description: item.description || undefined,
          })
          results.success++
        } else if (item.type === 'note') {
          await createNote({
            content: item.description || item.title,
          })
          results.success++
        } else if (item.type === 'reminder') {
          await createReminder({
            title: item.title,
            message: item.description || undefined,
            scheduled_at: item.reminder_at ? new Date(item.reminder_at).toISOString() : undefined,
          })
          results.success++
        }
      } catch {
        results.failed++
      }
    }

    setConfirmResult(results)
    setConfirming(false)

    if (results.success > 0) {
      const msg = results.success === 1
        ? 'Your item has been saved.'
        : `${results.success} items have been saved.`
      speak(msg)
    }
  }

  function handleDiscard() {
    navigate('/', { replace: true })
  }

  if (confirmResult) {
    return (
      <div className="pt-8 pb-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiCheck className="text-green-600" size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Items Saved!</h2>
        <div className="space-y-1 text-sm text-gray-600 mb-6">
          {confirmResult.success > 0 && (
            <p>
              {confirmResult.success} item{confirmResult.success !== 1 ? 's' : ''} created
            </p>
          )}
          {confirmResult.failed > 0 && (
            <p className="text-red-600">
              {confirmResult.failed} item{confirmResult.failed !== 1 ? 's' : ''} failed
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/', { replace: true })}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Back Home
          </button>
          <button
            onClick={() => navigate('/tasks', { replace: true })}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            View Tasks
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-4 pb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Review Extraction</h2>

      <div className="mb-4">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium"
        >
          {showTranscript ? <HiChevronDown size={16} /> : <HiChevronRight size={16} />}
          Original transcript
        </button>
        {showTranscript && (
          <div className="mt-2">
            <TranscriptDisplay
              transcript={transcript}
              onTranscriptChange={setTranscript}
            />
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500 font-medium">
            Analyzing your thoughts...
          </p>
        </div>
      )}

      {extractionError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-rose-700 font-medium">Extraction failed</p>
          <p className="text-sm text-rose-600 mt-1">{extractionError}</p>
          <button
            onClick={runExtraction}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {confirming && (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500 font-medium">
            Saving your items...
          </p>
        </div>
      )}

      {!loading && !extractionError && !confirming && extractedItems && (
        <>
          {extractedItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium">
                No actionable items found in this text.
              </p>
              <button
                onClick={() => navigate('/', { replace: true })}
                className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Try again
              </button>
            </div>
          ) : (
            <ExtractionPreview
              items={extractedItems}
              onConfirm={handleConfirm}
              onDiscard={handleDiscard}
            />
          )}
        </>
      )}
    </div>
  )
}
