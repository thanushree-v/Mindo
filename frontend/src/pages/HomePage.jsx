import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { formatDate } from '../utils/dates'
import { uploadVoice, submitText } from '../api/captures'
import MicButton from '../components/capture/MicButton'
import TextCaptureInput from '../components/capture/TextCaptureInput'
import TranscriptDisplay from '../components/capture/TranscriptDisplay'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const today = formatDate(new Date().toISOString())

  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState(null)
  const [error, setError] = useState(null)

  async function handleRecordingComplete(audioBlob) {
    setIsProcessing(true)
    setError(null)
    try {
      const result = await uploadVoice(audioBlob)
      setTranscript(result.transcript)
      navigate('/capture-review', {
        state: {
          transcript: result.transcript,
          captureId: result.id,
        },
      })
    } catch (err) {
      setError(err.message || 'Failed to process recording')
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleTextSubmit(text) {
    setIsProcessing(true)
    setError(null)
    try {
      const result = await submitText(text)
      setTranscript(text)
      navigate('/capture-review', {
        state: {
          transcript: result.transcript || text,
          captureId: result.id,
        },
      })
    } catch (err) {
      setError(err.message || 'Failed to process text')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="pt-6 pb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {getGreeting()}, {user?.name}!
        </h2>
        <p className="text-gray-500 mt-1">{today}</p>
      </div>

      <div className="flex justify-center mb-6">
        <MicButton
          onRecordingComplete={handleRecordingComplete}
          isProcessing={isProcessing}
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

      {transcript && (
        <div className="mb-4">
          <TranscriptDisplay
            transcript={transcript}
            onTranscriptChange={setTranscript}
          />
        </div>
      )}

      <div className="mt-4">
        <div className="relative flex items-center justify-center mb-4">
          <div className="border-t border-gray-200 flex-1"></div>
          <span className="px-3 text-xs text-gray-400 font-medium">or type instead</span>
          <div className="border-t border-gray-200 flex-1"></div>
        </div>
        <TextCaptureInput onSubmit={handleTextSubmit} isProcessing={isProcessing} />
      </div>
    </div>
  )
}
