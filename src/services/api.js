import axios from 'axios';

/**
 * Axios instance — all API calls go through here.
 * Set VITE_API_URL in .env to point to your backend.
 * In dev, Vite proxies /api → localhost:5000 automatically.
 */
console.log('API Base URL:', import.meta.env.VITE_API_URL || '/ (local proxy)');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 60000, 
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true
});

// ── Request/Response interceptors ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Unknown error';
    return Promise.reject(new Error(message));
  }
);

// ── API Functions ─────────────────────────────────────────────────────────────

/**
 * Transcribe an audio blob via Whisper.
 * @param {Blob} audioBlob  The recorded audio blob.
 * @param {string} mimeType  e.g. 'audio/webm' or 'audio/mp4'
 * @returns {Promise<{ transcript: string, rawAudio: string }>}
 *
 * M2: response will also include `issues` array from AI classifier
 */
export async function transcribeAudio(audioBlob, mimeType = 'audio/webm') {
  // Extract a clean extension (e.g. 'webm' from 'audio/webm;codecs=opus')
  const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
  const formData = new FormData();
  formData.append('audio', audioBlob, `recording.${ext}`);

  const response = await api.post('/api/notes/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/**
 * Analyze a transcript via OpenRouter.
 * @param {string} transcript
 * @returns {Promise<{ issues: Array<{ type, severity, quote, suggestedTask }> }>}
 */
export async function analyzeNote(transcript) {
  const response = await api.post('/api/notes/analyze', { transcript });
  return response.data;
}

/**
 * Save a note (transcript + issues + metadata) to the database.
 * @param {{ transcript: string, source?: string, rawAudio?: string, issues?: Array, analyzedAt?: Date }} data
 * @returns {Promise<{ success: boolean, note: object }>}
 */
export async function saveNote(data) {
  const response = await api.post('/api/notes/save', data);
  return response.data;
}

/**
 * Fetch all notes sorted by newest first.
 * @returns {Promise<Array<{ _id, transcript, source, createdAt }>>}
 */
export async function getNotes() {
  const response = await api.get('/api/notes');
  return response.data;
}

/**
 * Update a specific note (e.g. edit issues or transcript).
 * @param {string} id 
 * @param {object} data 
 * @returns {Promise<{ success: boolean, note: object }>}
 */
export async function updateNote(id, data) {
  const response = await api.put(`/api/notes/${id}`, data);
  return response.data;
}

/**
 * Delete a specific note by ID.
 * @param {string} id 
 * @returns {Promise<{ success: boolean }>}
 */
export async function deleteNote(id) {
  const response = await api.delete(`/api/notes/${id}`);
  return response.data;
}

export default api;
