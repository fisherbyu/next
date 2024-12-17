import type { Metadata } from "next";
import { StaticImageData } from "next/image";
import Image from "next/image";
import MasonryBlock from "@/components/ui/masonry-block";
import PageTitle from "@/components/ui/page-title";
import { MasonryLayout } from "thread-ui";
import path from 'path';
import fs from 'fs';

// Helper function to convert filename to proper alt text
const getAltText = (filename: string): string => {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove file extension
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

// Type for our image metadata
interface ImageMetadata {
  src: StaticImageData;
  alt: string;
}

// Function to dynamically import all images from a directory
async function getImages(directory: string): Promise<ImageMetadata[]> {
  const imagesDirectory = path.join(process.cwd(), 'public', directory);
  
  try {
    const filenames = fs.readdirSync(imagesDirectory);
    const imagePromises = filenames
      .filter(filename => /\.(jpg|jpeg|png|webp)$/i.test(filename))
      .map(async (filename) => {
        const image = await import(`@/public/${directory}/${filename}`);
        return {
          src: image.default,
          alt: getAltText(filename),
        };
      });

    const images = await Promise.all(imagePromises);
    return shuffleArray(images); // Shuffle the images array
  } catch (error) {
    console.error('Error loading images:', error);
    return [];
  }
}

const title = {
  title: "My Photography",
  subtitle: "Here are some of my photos I've taken over the years. I got interested in photography because my sister is an amazing photographer and I love capturing moments."
};

export default async function PhotographyPage() {
  // Dynamically load and shuffle all images from the photography directory
  const photos = await getImages('photography');
  const photoList = photos.map((photo) => (
    <Image 
      key={photo.alt}
      src={photo.src} 
      alt={photo.alt}
      placeholder="blur"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  ));

  return (
    <main>
      <PageTitle components={title} />
      <MasonryLayout components={photoList} />
    </main>
  );
}

export const metadata: Metadata = {
  title: "My Photography"
};