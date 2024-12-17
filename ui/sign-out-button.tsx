'use client';
import { Button } from 'thread-ui';
import { handleSignOut } from '@/lib/actions';

export const SignOutButton = () => {
	return (
		<Button
			margin="0px"
			color="grey"
			onClick={async () => {
				await handleSignOut();
			}}
		>
			Sign Out
		</Button>
	);
};
