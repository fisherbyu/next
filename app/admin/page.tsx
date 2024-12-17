import PageTitle from '@/components/ui/page-title';
import ImageUpload from '@/ui/image-upload';

const title: { title: string; subtitle?: string; center?: boolean } = {
	title: 'Add a Photo',
	center: true,
};

export default function Admin() {
	return (
		<section className="container">
			<PageTitle components={title} />
			<ImageUpload />
		</section>
	);
}
