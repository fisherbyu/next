import PageTitle from '@/components/ui/page-title';
import ImageUpload from '@/ui/image-upload';
import { Button, Divider } from 'thread-ui';

const title: { title: string; subtitle?: string; center?: boolean } = {
	title: 'Add a Photo',
	center: true,
};

export default function Admin() {
	return (
		<section className="container">
			<div className="container my-5 w-6/12">
				<div className="flex flex-row w-full mx-auto justify-between">
					<h1 className=" text-center  dark:text-white text-3xl md:text-4xl xl:text-5xl font-medium text-gray-900">Admin</h1>
					<Button>Sign Out</Button>
				</div>
				<div className="mx-auto py-4 w-full">
					<Divider width="100%" />
				</div>
			</div>
			<PageTitle components={title} />
			<ImageUpload />
		</section>
	);
}
