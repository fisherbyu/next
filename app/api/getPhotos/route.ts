// app/api/getPhotos/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { StaticImageData } from 'next/image';

// Helper function to convert filename to proper alt text
const getAltText = (filename: string): string => {
  return filename
    .replace(/\.[^/.]+$/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// GET handler for the API route
export async function GET() {
  try {
    const imagesDirectory = path.join(process.cwd(), 'public', 'photography');
    const filenames = fs.readdirSync(imagesDirectory);
    
    const imageMetadata = filenames
      .filter(filename => /\.(jpg|jpeg|png|webp)$/i.test(filename))
      .map((filename) => ({
        src: `/photography/${filename}`,
        alt: getAltText(filename),
        lastModified: fs.statSync(path.join(imagesDirectory, filename)).mtime.getTime()
      }));

    const shuffledImages = shuffleArray(imageMetadata);
    
    return NextResponse.json({
      images: shuffledImages,
      lastUpdate: Math.max(...imageMetadata.map(img => img.lastModified))
    });
  } catch (error) {
    console.error('Error loading images:', error);
    return NextResponse.json({ error: 'Failed to load images' }, { status: 500 });
  }
}