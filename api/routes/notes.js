const express = require('express');
const router = express.Router();
const multer = require('multer');
const os = require('os');
const path = require('path');
const { transcribeNote, analyzeNote, saveNote, getNotes, deleteNote } = require('../controllers/notesController');

// Multer setup for file uploads
// Use /tmp for Vercel compatibility
const upload = multer({ 
  dest: os.tmpdir(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// POST /api/notes/transcribe — upload audio → Whisper → transcript
router.post('/transcribe', upload.single('audio'), transcribeNote);

// POST /api/notes/analyze — transcript → OpenRouter → issues
router.post('/analyze', analyzeNote);

// POST /api/notes/save — save transcript + issues to MongoDB
router.post('/save', saveNote);

// GET /api/notes — fetch all notes newest first
router.get('/', getNotes);

// DELETE /api/notes/:id — delete a specific note
router.delete('/:id', deleteNote);

module.exports = router;
