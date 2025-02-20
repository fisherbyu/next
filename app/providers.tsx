// app/providers.tsx
'use client';
import { ThemeProvider } from 'thread-ui';
import { ThreadTheme } from './config/theme';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider initialTheme={ThreadTheme} initialMode="light">
			{children}
		</ThemeProvider>
	);
}
