import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { User } from '@/lib/definitions/user';

import { Admin } from './lib/constants/admin';

function getPassword(): string {
	const password = process.env.PASSWORD;
	if (!password) {
		throw new Error('PASSWORD environment variable is not set');
	}
	return password;
}

export const { auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			async authorize(credentials): Promise<User | null> {
				const parsedCredentials = z.object({ password: z.string().min(2) }).safeParse(credentials);
				if (parsedCredentials.success) {
					const { password } = parsedCredentials.data;
					const adminPassword = getPassword();
					if (!adminPassword) return null;
					console.log(adminPassword);

					// const passwordsMatch = await bcrypt.compare(password, adminPassword);
					const passwordsMatch = password === adminPassword;

					if (passwordsMatch) return Admin;
				}

				console.log('Invalid credentials');
				return null;
			},
		}),
	],
});
