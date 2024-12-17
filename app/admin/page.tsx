import ImageUpload from '@/ui/image-upload';
import { SignOutButton } from '@/ui/sign-out-button';
import { Metadata } from 'next';
import { Divider } from 'thread-ui';

export default function Admin() {
	return (
		<>
			<div className="container my-5 w-6/12">
				<div className="flex flex-row w-full justify-between">
					<h1 className="text-center dark:text-white text-3xl md:text-4xl xl:text-5xl font-medium text-gray-900">Admin</h1>
					<SignOutButton />
				</div>
				<div className="mx-auto py-4 w-full">
					<Divider width="100%" />
				</div>
			</div>
			<section className="container">
				<ImageUpload />
			</section>
		</>
	);
}

export let metadata: Metadata = {
	title: 'Admin',
};
