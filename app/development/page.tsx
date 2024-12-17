import type { Metadata } from 'next';
import NotionPreview from '@/components/ui/notion-preview';
import articles from '@/app/development/articles.json';
import PageTitle from '@/components/ui/page-title';

const title: { title: string; subtitle?: string } = {
	title: 'My Software Projects',
	subtitle:
		"Here is where I'll display projects I've worked on to display some of the things I've learned or taught myself.    I've also written a few articles on different technologies to serve as guides/quick references.",
};

export default function DevelopmentPage() {
	return (
		<main>
			<PageTitle components={title} />
			<section className="container">
				<h1 className="text-left dark:text-white text-2xl md:text-3xl xl:text-4xl font-medium text-gray-900 w-10/12 p-5">
					Articles
				</h1>
				<div className="grid grid-cols-1 gap-12 mt-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 ">
					{articles.map((articles, index) => (
						<NotionPreview key={index} page={articles} />
					))}
				</div>
			</section>
		</main>
	);
}

export let metadata: Metadata = {
	title: 'My Development Projects',
};
