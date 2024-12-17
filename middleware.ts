import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function middleware(request: NextRequest) {
	const session = await auth();
	const isOnLoginPage = request.nextUrl.pathname === '/login';
	const isOnAdminPage = request.nextUrl.pathname.startsWith('/admin');

	// If user is logged in and tries to access login page, redirect to admin
	if (isOnLoginPage && session?.user) {
		return NextResponse.redirect(new URL('/admin', request.url));
	}

	// If user is not logged in and tries to access admin pages, redirect to login
	if (isOnAdminPage && !session?.user) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/login', '/admin/:path*'],
};
