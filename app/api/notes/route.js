import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Note from '@/lib/Note';

export async function GET() {
  try {
    await connectDB();
    const notes = await Note.find().sort({ createdAt: -1 });
    return NextResponse.json(notes);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}
