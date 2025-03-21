import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';
  const isPublicRoute = pathname === '/' || pathname.startsWith('/create');

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Allow access to login page
  if (isLoginPage) {
    return NextResponse.next();
  }

  // Check for admin routes
  if (isAdminRoute) {
    // Firebase auth stores the session in localStorage, so we don't need to check cookies
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 