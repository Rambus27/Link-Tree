import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PageModel from '@/lib/models/Page';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { config, username } = body;

    if (!config || !config.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (username) {
      const existing = await PageModel.findOne({ username });
      if (existing) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
      }
    }

    const publicId = nanoid(10);
    const page = await PageModel.create({
      publicId,
      username: username || undefined,
      config: { ...config, username: username || undefined },
      viewCount: 0,
    });

    return NextResponse.json({
      success: true,
      publicId: page.publicId,
      username: page.username,
      url: username ? `/u/${username}` : `/p/${publicId}`,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
