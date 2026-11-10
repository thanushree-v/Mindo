import { useState, useRef, useEffect } from 'react'

export default function TextCaptureInput({ onSubmit, isProcessing = false }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [text])

  function handleSubmit() {
    const trimmed = text.trim()
    if (!trimmed || isProcessing) return
    onSubmit(trimmed)
    setText('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your thought..."
        disabled={isProcessing}
        className="w-full border border-gray-200 rounded-lg p-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none min-h-[80px] disabled:bg-gray-50 disabled:text-gray-400"
        rows={3}
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-400">Ctrl+Enter to submit</span>
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || isProcessing}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : (
            'Process'
          )}
        </button>
      </div>
    </div>
  )
}
