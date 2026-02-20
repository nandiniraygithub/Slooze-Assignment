import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const userCookie = request.cookies.get('user')?.value;
    const { pathname } = request.nextUrl;

    console.log(`Middleware: ${pathname}, token: ${!!token}`);

    // Paths that don't require authentication
    if (pathname === '/login' || pathname === '/signup') {
        if (token) {
            return NextResponse.redirect(new URL('/products', request.url));
        }
        return NextResponse.next();
    }

    // Protected paths
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-based gating for /dashboard
    if (pathname === '/dashboard') {
        try {
            const user = JSON.parse(userCookie || '{}');
            if (user.role !== 'MANAGER') {
                return NextResponse.redirect(new URL('/products', request.url));
            }
        } catch (e) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/products/:path*', '/login', '/signup'],
};
