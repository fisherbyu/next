'use client';
import { LoginForm } from '@/ui/login_form';

export default function Login() {
	return (
		<main className="flex flex-grow py-7">
			<section className="container p-4">
				<LoginForm />
			</section>
		</main>
	);
}
