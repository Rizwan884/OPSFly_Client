import axios from 'axios';

// In Next.js, API routes are relative to the current domain
const api = axios.create({
  baseURL: '', 
  timeout: 60000, 
  headers: {
    Accept: 'application/json',
  }
});

// Interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Unknown error';
    return Promise.reject(new Error(message));
  }
);

/**
 * Transcribe an audio blob (Vercel note: Whisper usually needs a separate long-running server
 * but for now we call the analyze endpoint after local transcription).
 */
export async function transcribeAudio(audioBlob) {
  // Placeholder: actual Whisper on Vercel requires special handling
  // For now, we rely on the browser's SpeechRecognition in the Recording page
  return { transcript: "" };
}

/**
 * Analyze a transcript via Next.js API Route
 */
export async function analyzeNote(transcript) {
  const response = await api.post('/api/notes/analyze', { transcript });
  return response.data;
}

/**
 * Save a note to the database via Next.js API Route
 */
export async function saveNote(data) {
  const response = await api.post('/api/notes/save', data);
  return response.data;
}

/**
 * Fetch all notes
 */
export async function getNotes() {
  const response = await api.get('/api/notes');
  return response.data;
}

/**
 * Delete a specific note
 */
export async function deleteNote(id) {
  const response = await api.delete(`/api/notes/${id}`);
  return response.data;
}

export default api;
