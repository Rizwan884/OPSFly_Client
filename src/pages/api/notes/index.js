import connectDB from '@/lib/mongodb';
import Note from '@/lib/Note';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    await connectDB();
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Fetch failed' });
  }
}
