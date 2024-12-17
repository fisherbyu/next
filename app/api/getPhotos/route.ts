'use server';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Define types for our cache
interface PhotoCache {
	images: ImageMetadata[];
	lastUpdate: number;
	lastCheck: number;
}

interface ImageMetadata {
	src: string;
	alt: string;
	lastModified: number;
}

// Declare global cache variable
declare global {
	var photoCache: PhotoCache | undefined;
}

// Cache duration (5 minutes)
const CACHE_DURATION = 1 * 60 * 1000;

// Helper function to convert filename to proper alt text
const getAltText = (filename: string): string => {
	return filename
		.replace(/\.[^/.]+$/, '')
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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

// Function to load images
async function loadImages() {
	const imagesDirectory = path.join(process.cwd(), 'public', 'photography');
	const filenames = fs.readdirSync(imagesDirectory);

	const imageMetadata = filenames
		.filter((filename) => /\.(jpg|jpeg|png|webp)$/i.test(filename))
		.map((filename) => ({
			src: `/photography/${filename}`,
			alt: getAltText(filename),
			lastModified: fs.statSync(path.join(imagesDirectory, filename)).mtime.getTime(),
		}));

	return {
		images: shuffleArray(imageMetadata),
		lastUpdate: Math.max(...imageMetadata.map((img) => img.lastModified)),
		lastCheck: Date.now(),
	};
}

// GET handler for the API route
export async function GET() {
	try {
		const now = Date.now();

		// Check if cache exists and is still valid
		if (global.photoCache && now - global.photoCache.lastCheck < CACHE_DURATION) {
			return NextResponse.json(global.photoCache);
		}

		// Load fresh data
		const freshData = await loadImages();

		// Update cache
		global.photoCache = freshData;

		return NextResponse.json(freshData);
	} catch (error) {
		console.error('Error loading images:', error);
		return NextResponse.json({ error: 'Failed to load images' }, { status: 500 });
	}
}
