import { NextRequest, NextResponse } from 'next/server'
function roleHome(role?: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/overview'
    case 'MANAGER':
      return '/company'
    case 'DRIVER':
      return '/driver/orders'
    case 'ACCOUNTANT':
      return '/company'
    case 'DISPATCHER':
      return '/company'
    case 'CUSTOMER':
      return '/booking'
    default:
      return '/'
  }
}
const protectedPrefixes = ['/admin', '/company', '/driver', '/booking', '/orders', '/profile']
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/_next')) return NextResponse.next()
  if (pathname.startsWith('/company/public')) {
    return NextResponse.next()
  }
  const authToken = request.cookies.get('authToken')?.value
  const userRole = request.cookies.get('userRole')?.value
  if (pathname === '/login') {
    if (authToken && userRole) {
      return NextResponse.redirect(new URL(roleHome(userRole), request.url))
    }
    return NextResponse.next()
  }
  const needsAuth = protectedPrefixes.some((p) => pathname.startsWith(p))
  if (needsAuth && !authToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }
  if (authToken && userRole) {
    if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL(roleHome(userRole), request.url))
    }
    if (pathname.startsWith('/driver') && !(userRole === 'DRIVER' || userRole === 'ADMIN')) {
      return NextResponse.redirect(new URL(roleHome(userRole), request.url))
    }
    if (pathname.startsWith('/company') && !(['MANAGER', 'ACCOUNTANT', 'DISPATCHER', 'ADMIN'].includes(userRole))) {
      return NextResponse.redirect(new URL(roleHome(userRole), request.url))
    }
    if (pathname.startsWith('/booking') && !(['CUSTOMER', 'ADMIN'].includes(userRole))) {
      return NextResponse.redirect(new URL(roleHome(userRole), request.url))
    }
  }
  return NextResponse.next()
}
export const config = {
  matcher: [
    '/((?!_next|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|svg|gif|webp|css|js|map|json)).*)',
  ],
}