import { NextResponse } from 'next/server';

// Define protected route patterns
const PROTECTED_ROUTES = [
  '/profile',
  '/exam',
  // '/learn',
];

// Define public routes that should redirect to home if authenticated
const AUTH_ROUTES = ['/auth'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if user has refresh token (HTTPOnly cookie)
  const refreshToken = request.cookies.get('refresh_token');
  const isAuthenticated = !!refreshToken;

  // Check if the current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = AUTH_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  // Redirect to auth page if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to home/profile if accessing auth page while authenticated
  if (isAuthRoute && isAuthenticated) {
    const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/profile';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, videos, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|woff2)).*)',
  ],
};

