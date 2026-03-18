import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PageModel from '@/lib/models/Page';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    await connectDB();
    const page = await PageModel.findOne({ username: params.username });
    
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
