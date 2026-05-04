import connectDB from '@/lib/mongodb';
import Note from '@/lib/Note';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    await connectDB();
    const note = await Note.create(req.body);
    res.status(201).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ error: 'Save failed' });
  }
}
