// app/providers.tsx
'use client';

import { ThemeProvider } from 'thread-ui';
import { BASE_THEME } from './config/theme';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider initialTheme={BASE_THEME} initialMode="light">
			{children}
		</ThemeProvider>
	);
}
