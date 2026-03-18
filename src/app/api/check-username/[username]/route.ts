import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PageModel from '@/lib/models/Page';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectDB();
    const { username } = await params;
    const existing = await PageModel.findOne({ username });
    return NextResponse.json({ available: !existing });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
