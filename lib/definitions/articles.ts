export type IconType = 'emoji' | 'svg';

export interface Article {
	title: string;
	url: string;
	icon: {
		type: IconType;
		content: string;
	};
	img: string;
}
