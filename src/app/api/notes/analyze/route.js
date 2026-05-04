import { NextResponse } from 'next/server';
import { analyzeTranscript } from '@/lib/analyzer';

export async function GET() {
  return NextResponse.json({ message: 'AI Analysis endpoint is active (POST only)' });
}

export async function POST(req) {
  try {
    const { transcript } = await req.json();
    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }
    const analysis = await analyzeTranscript(transcript);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
