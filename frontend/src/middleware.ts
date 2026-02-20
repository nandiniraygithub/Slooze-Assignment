import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    console.log(`Middleware: ${pathname}`);

    // Paths that don't require authentication
    if (pathname === '/login' || pathname === '/signup') {
        return NextResponse.next();
    }

    // For all other paths, let the client-side handle authentication
    // The home page will redirect to login, and other pages will check localStorage
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/products/:path*', '/login', '/signup', '/'],
};
