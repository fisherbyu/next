'use client';
import useSWR from 'swr';
import Image from 'next/image';
import { MasonryLayout } from 'thread-ui';
import PhotoSkeleton from './photoSkeleton';

interface ImageMetadata {
	src: string;
	alt: string;
	lastModified: number;
}

interface PhotoResponse {
	images: ImageMetadata[];
	lastUpdate: number;
}

const fetcher = async (url: string): Promise<PhotoResponse> => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Failed to fetch photos');
	}
	return response.json();
};

export default function DisplayPhotos() {
	const { data, error } = useSWR<PhotoResponse>('/api/getPhotos', fetcher, {
		// refreshInterval: 60000, // Poll every minute
		revalidateOnFocus: true, // Revalidate when tab becomes active
	});

	if (error) {
		return <div>Error loading photos</div>;
	}

	if (!data) {
		return <PhotoSkeleton />;
	}

	const photoList = data.images.map((photo) => (
		<Image
			key={photo.alt}
			src={photo.src}
			alt={photo.alt}
			width={500}
			height={300}
			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
		/>
	));

	return <MasonryLayout components={photoList} />;
}
