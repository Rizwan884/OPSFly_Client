import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Note from '@/lib/Note';

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    
    if (!data.transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const note = await Note.create({
      transcript: data.transcript,
      source: data.source || 'voice',
      issues: data.issues || [],
      analyzedAt: data.analyzedAt || null,
      rawAudio: data.rawAudio || null
    });

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}
