import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    // Sanitize filename: remove all special characters and spaces
    const fileExtension = path.extname(file.name).toLowerCase();
    const baseFilename = path.basename(file.name, fileExtension)
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 32); // Limit base filename length

    // Create unique filename with timestamp
    const uniqueSuffix = Date.now();
    const filename = `${baseFilename}-${uniqueSuffix}${fileExtension}`;
    
    // Ensure the filename only contains safe characters
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\.[a-zA-Z0-9]+$/.test(filename)) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    const filepath = path.join(uploadsDir, filename);
    
    // Save the file using Uint8Array
    await writeFile(filepath, new Uint8Array(buffer));

    // Return the public URL
    const publicPath = `/uploads/${filename}`;
    
    return NextResponse.json({
      success: true,
      url: publicPath
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
