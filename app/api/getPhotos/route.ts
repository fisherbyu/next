'use server';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

interface ImageMetadata {
	src: string;
	alt: string;
	lastModified: number;
	width: number;
	height: number;
}

interface PhotoCache {
	images: ImageMetadata[];
	lastUpdate: number;
	lastCheck: number;
}

declare global {
	var photoCache: PhotoCache | undefined;
}

const CACHE_DURATION = 1 * 60 * 1000;

const getAltText = (filename: string): string => {
	return filename
		.replace(/\.[^/.]+$/, '')
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

async function getImageDimensions(filepath: string): Promise<{ width: number; height: number }> {
	try {
		const metadata = await sharp(filepath).metadata();
		return {
			width: metadata.width || 0,
			height: metadata.height || 0,
		};
	} catch (error) {
		console.error(`Error getting dimensions for ${filepath}:`, error);
		return { width: 0, height: 0 };
	}
}

async function loadImages() {
	const imagesDirectory = path.join(process.cwd(), 'public', 'photography');
	const filenames = fs.readdirSync(imagesDirectory);

	// Process images in parallel for better performance
	const imageMetadataPromises = filenames
		.filter((filename) => /\.(jpg|jpeg|png|webp)$/i.test(filename))
		.map(async (filename) => {
			const filepath = path.join(imagesDirectory, filename);
			const dimensions = await getImageDimensions(filepath);

			return {
				src: `/photography/${filename}`,
				alt: getAltText(filename),
				lastModified: fs.statSync(filepath).mtime.getTime(),
				width: dimensions.width,
				height: dimensions.height,
			};
		});

	const imageMetadata = await Promise.all(imageMetadataPromises);

	return {
		images: shuffleArray(imageMetadata),
		lastUpdate: Math.max(...imageMetadata.map((img) => img.lastModified)),
		lastCheck: Date.now(),
	};
}

export async function GET() {
	try {
		const now = Date.now();

		if (global.photoCache && now - global.photoCache.lastCheck < CACHE_DURATION) {
			return NextResponse.json(global.photoCache);
		}

		const freshData = await loadImages();
		global.photoCache = freshData;
		return NextResponse.json(freshData);
	} catch (error) {
		console.error('Error loading images:', error);
		return NextResponse.json({ error: 'Failed to load images' }, { status: 500 });
	}
}
