// app/config/theme.ts
import { createTheme, createAppliedTheme } from 'thread-ui';

const THREAD_CONFIG = {
	colors: {
		primary: {
			light: '#4f46e5',
			main: '#4338ca',
			dark: '#3730a3',
		},
	},
} as const;

// Create once at module level
export const BASE_THEME = createTheme(THREAD_CONFIG);

// Export a function to get theme settings
export function getThemeSettings(mode: 'light' | 'dark' = 'light') {
	return createAppliedTheme(BASE_THEME, mode);
}
