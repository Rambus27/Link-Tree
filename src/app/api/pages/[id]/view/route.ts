import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PageModel from '@/lib/models/Page';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await PageModel.findOneAndUpdate(
      { publicId: params.id },
      { $inc: { viewCount: 1 } }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
