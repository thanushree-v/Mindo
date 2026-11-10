import { useCallback } from 'react'
import useAudioRecorder from '../../hooks/useAudioRecorder'
import RecordingIndicator from './RecordingIndicator'

export default function MicButton({ onRecordingComplete, isProcessing = false }) {
  const {
    isRecording,
    duration,
    error,
    permissionDenied,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder()

  const handleTap = useCallback(async () => {
    if (isProcessing) return

    if (isRecording) {
      const blob = await stopRecording()
      if (blob && onRecordingComplete) {
        onRecordingComplete(blob)
      }
    } else {
      resetRecording()
      await startRecording()
    }
  }, [isRecording, isProcessing, stopRecording, startRecording, resetRecording, onRecordingComplete])

  const buttonClasses = isProcessing
    ? 'bg-indigo-600 cursor-not-allowed'
    : isRecording
      ? 'bg-rose-500 hover:bg-rose-600'
      : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {isRecording && (
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-rose-400 animate-ping opacity-30"></div>
        )}
        <button
          onClick={handleTap}
          disabled={isProcessing}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-lg transition-all duration-200 ${buttonClasses}`}
          aria-label={
            isProcessing
              ? 'Processing recording'
              : isRecording
                ? 'Stop recording'
                : 'Start recording'
          }
        >
          {isProcessing ? (
            <span className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : isRecording ? (
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          )}
        </button>
      </div>

      {isRecording && <RecordingIndicator duration={duration} />}

      {!isRecording && !isProcessing && (
        <p className="mt-3 text-sm text-gray-400">Tap to record</p>
      )}

      {isProcessing && (
        <p className="mt-3 text-sm text-indigo-600 font-medium">
          Processing your recording...
        </p>
      )}

      {permissionDenied && (
        <div className="mt-3 bg-rose-50 border border-rose-200 rounded-lg px-4 py-2 max-w-xs">
          <p className="text-sm text-rose-700 font-medium">Microphone access denied</p>
          <p className="text-xs text-rose-600 mt-1">
            Please allow microphone access in your browser settings to use voice capture.
          </p>
        </div>
      )}

      {error && !permissionDenied && (
        <div className="mt-3 bg-rose-50 border border-rose-200 rounded-lg px-4 py-2 max-w-xs">
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}
    </div>
  )
}
