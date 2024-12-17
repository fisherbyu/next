'use client';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { MasonryLayout } from 'thread-ui';

interface ImageMetadata {
	src: string;
	alt: string;
	lastModified: number;
}

export default function DisplayPhotos() {
	const [photos, setPhotos] = useState<ImageMetadata[]>([]);
	const [lastUpdate, setLastUpdate] = useState<number>(0);

	// Fetch photos from the API
	const fetchPhotos = async () => {
		try {
			const response = await fetch('/api/getPhotos');
			const data = await response.json();

			if (data.lastUpdate !== lastUpdate) {
				setPhotos(data.images);
				setLastUpdate(data.lastUpdate);
			}
		} catch (error) {
			console.error('Error fetching photos:', error);
		}
	};

	// Initial load and periodic check for updates
	useEffect(() => {
		fetchPhotos();

		// Check for new photos every minute
		const interval = setInterval(fetchPhotos, 60000);
		return () => clearInterval(interval);
	}, []);

	// Memoize the photo list to prevent unnecessary re-renders
	const photoList = useMemo(() => {
		return photos.map((photo) => (
			<Image
				key={photo.alt}
				src={photo.src}
				alt={photo.alt}
				width={500}
				height={300}
				sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
			/>
		));
	}, [photos]);

	return <MasonryLayout components={photoList} />;
}
