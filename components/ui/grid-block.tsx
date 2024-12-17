import Image, { StaticImageData } from 'next/image';

interface ComponentItem {
	title?: string;
	content?: string;
	image: {
		src: StaticImageData;
		alt: string;
	};
}

interface GridSkeletonProps {
	mdcol: number;
	lgcol: number;
	children: React.ReactNodeArray;
}

export function GridSkeleton({ mdcol, lgcol, children }: GridSkeletonProps) {
	const mdColMapping = {
		1: 'md:grid-cols-1',
		2: 'md:grid-cols-2',
		3: 'md:grid-cols-3',
		4: 'md:grid-cols-4',
		5: 'md:grid-cols-5',
		6: 'md:grid-cols-6',
	};
	const lgColMapping = {
		1: 'lg:grid-cols-1',
		2: 'lg:grid-cols-2',
		3: 'lg:grid-cols-3',
		4: 'lg:grid-cols-4',
		5: 'lg:grid-cols-5',
		6: 'lg:grid-cols-6',
		7: 'lg:grid-cols-7',
		8: 'lg:grid-cols-8',
		9: 'lg:grid-cols-9',
		10: 'lg:grid-cols-10',
		11: 'lg:grid-cols-11',
		12: 'lg:grid-cols-12',
	};
	return <div className={`grid grid-cols-1 md:grid-cols-${mdcol} lg:grid-cols-${lgcol} gap-12 lg:gap-6`}>{children}</div>;
}
