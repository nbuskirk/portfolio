import { NextResponse } from 'next/server';
import { readFileContent } from '@/lib/filesystem';

export async function POST(req: Request) {
  const { path } = await req.json();
  try {
    const content = await readFileContent(path);
    return NextResponse.json({ success: true, contents: content });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e) },
      { status: 500 }
    );
  }
}
