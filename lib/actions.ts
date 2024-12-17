'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function authenticate(prevState: string | undefined, formData: FormData) {
	try {
		await signIn('credentials', {
			...Object.fromEntries(formData),
			redirect: false,
		});

		// If sign in was already succesful @ '/login', redirect to '/'
		redirect('/admin');
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return 'Invalid credentials.';
				default:
					return 'Something went wrong.';
			}
		}
		throw error;
	}
}

export async function handleSignOut() {
	await signOut({ redirectTo: '/' });
	redirect('/');
}
