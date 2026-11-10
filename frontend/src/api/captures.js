import { apiPost, apiGet } from './client'
import { convertBlobToWav } from '../utils/audioConverter'

export const uploadVoice = async (audioBlob) => {
  const token = localStorage.getItem('minddo_token')

  const wavBlob = await convertBlobToWav(audioBlob)

  const formData = new FormData()
  formData.append('file', wavBlob, 'recording.wav')

  const response = await fetch('/api/v1/captures/voice', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Upload failed' }))
    throw new Error(error.detail || `HTTP ${response.status}`)
  }

  return response.json()
}

export const submitText = (text) => apiPost('/api/v1/captures/text', { text })
export const getCaptures = (page = 1) => apiGet(`/api/v1/captures?page=${page}`)
export const getCapture = (id) => apiGet(`/api/v1/captures/${id}`)
