export default function RecordingIndicator({ duration }) {
  const minutes = String(Math.floor(duration / 60)).padStart(2, '0')
  const seconds = String(duration % 60).padStart(2, '0')

  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
      </span>
      <span className="text-rose-600 font-medium text-sm">Recording...</span>
      <span className="text-gray-700 font-mono text-lg font-semibold">
        {minutes}:{seconds}
      </span>
    </div>
  )
}
