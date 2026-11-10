import { apiPost } from './client'

export const extractFromTranscript = (data) => apiPost('/api/v1/extractions/preview', data)
