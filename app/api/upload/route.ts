import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'uploads', 'your-file.csv');

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json({ fileContent });
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Ensure the uploads directory exists
    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    // Write the file to the uploads directory
    const filePath = path.join(uploadDir, 'your-file.csv');
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ message: 'File uploaded successfully', filePath });
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
