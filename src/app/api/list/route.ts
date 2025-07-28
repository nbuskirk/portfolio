import { NextResponse } from 'next/server';
import { listDirectory } from '@/lib/filesystem';

export async function POST(req: Request) {
  const { path } = await req.json();
  try {
    const contents = await listDirectory(path);
    return NextResponse.json({ success: true, contents });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e) },
      { status: 500 }
    );
  }
}
