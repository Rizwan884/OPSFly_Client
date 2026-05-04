import axios from 'axios';

/**
 * Axios instance — all API calls go through here.
 * Set VITE_API_URL in .env to point to your backend.
 * In dev, Vite proxies /api → localhost:5173 automatically.
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
 */
export async function transcribeAudio(audioBlob, mimeType = 'audio/webm') {
  const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
  const formData = new FormData();
  formData.append('audio', audioBlob, `recording.${ext}`);

  const response = await api.post('/api/notes/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/**
 * Analyze a transcript via OpenRouter (Milestone 2).
 * @param {string} transcript 
 * @returns {Promise<{ issues: Array }>}
 */
export async function analyzeNote(transcript) {
  const response = await api.post('/api/notes/analyze', { transcript });
  return response.data;
}

/**
 * Save a note (transcript + issues + metadata) to the database.
 */
export async function saveNote(data) {
  const response = await api.post('/api/notes/save', data);
  return response.data;
}

/**
 * Fetch all notes sorted by newest first.
 */
export async function getNotes() {
  const response = await api.get('/api/notes');
  return response.data;
}

/**
 * Delete a specific note by ID.
 */
export async function deleteNote(id) {
  const response = await api.delete(`/api/notes/${id}`);
  return response.data;
}

export default api;
