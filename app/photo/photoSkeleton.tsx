import { MasonryLayout } from 'thread-ui';

// Define box dimensions for variety
const boxSizes = [
	{ width: 'w-full', height: 'h-48' }, // Small
	{ width: 'w-full', height: 'h-56' }, // Medium
	{ width: 'w-full', height: 'h-80' }, // Large
];

// Pre-generate array of skeleton items for performance
const skeletonItems = Array.from({ length: 28 }, (_, index) => {
	const size = boxSizes[Math.floor(index % 3)];

	return (
		<div
			key={`skeleton-${index}`}
			className={`${size.width} ${size.height} animate-pulse bg-gray-200 rounded`}
			aria-hidden="true"
		/>
	);
});

const PhotoSkeleton = () => {
	return (
		<div role="status" aria-label="Loading photos">
			<MasonryLayout components={skeletonItems} />
			<span className="sr-only">Loading photos...</span>
		</div>
	);
};

export default PhotoSkeleton;
