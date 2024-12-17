// app/api/uploadPhoto/route.ts
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { mkdir, access } from 'fs/promises';

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
    const uploadsDir = path.join(process.cwd(), 'public', 'photography');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    // Get file extension and clean the filename
    const fileExtension = path.extname(file.name).toLowerCase();
    const baseFilename = path.basename(file.name, fileExtension)
      .replace(/[^a-zA-Z0-9-]/g, '') // Allow hyphens in the filename
      .slice(0, 32);

    let filename = `${baseFilename}${fileExtension}`;
    let filepath = path.join(uploadsDir, filename);
    
    // Check if file exists and append number if it does
    let counter = 1;
    while (true) {
      try {
        await access(filepath);
        // File exists, try next number
        filename = `${baseFilename}-${counter}${fileExtension}`;
        filepath = path.join(uploadsDir, filename);
        counter++;
      } catch {
        // File doesn't exist, we can use this name
        break;
      }
    }
    
    // Save the file using Uint8Array
    await writeFile(filepath, new Uint8Array(buffer));

    // Return the public URL
    const publicPath = `/photography/${filename}`;
    
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