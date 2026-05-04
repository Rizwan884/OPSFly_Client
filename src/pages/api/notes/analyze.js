import { analyzeTranscript } from '@/lib/analyzer';

export default async function handler(req, res) {
  if (req.method === 'GET') return res.status(200).json({ message: 'API is ALIVE' });
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { transcript } = req.body;
    const analysis = await analyzeTranscript(transcript);
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed' });
  }
}
