import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/analyze', '/results', '/history'];

export function proxy(request: NextRequest) {
  const token    = request.cookies.get('auth-token')?.value;
  const path     = request.nextUrl.pathname;
  const isProtected = PROTECTED.some(p => path.startsWith(p));

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  if (path === '/login' && token) {
    return NextResponse.redirect(new URL('/analyze', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|svg|ico)$).*)'],
};
