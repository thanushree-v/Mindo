import { useCallback, useRef } from 'react'

export default function useTTS() {
  const audioRef = useRef(null)

  const speak = useCallback(async (text, language = 'en') => {
    try {
      const token = localStorage.getItem('minddo_token')
      const response = await fetch('/api/v1/tts/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, language }),
      })

      if (!response.ok) return

      const contentType = response.headers.get('content-type') || ''

      // If mock provider returns JSON (no audio), skip playback
      if (contentType.includes('json')) return

      const audioBlob = await response.blob()
      if (audioBlob.size === 0) return

      const url = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.pause()
        URL.revokeObjectURL(audioRef.current.src)
      }

      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => URL.revokeObjectURL(url)
      await audio.play()
    } catch {
      // TTS is optional — never block the UI
    }
  }, [])

  return { speak }
}
