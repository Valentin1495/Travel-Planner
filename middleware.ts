import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

let locales = ['en', 'ko'];
let defaultLocale = 'en';

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest): string {
  // 1. 쿠키에서 선호 언어 확인
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Accept-Language 헤더에서 선호 언어 확인
  let headers = new Headers(request.headers);
  let acceptLanguage = headers.get('Accept-Language');
  if (acceptLanguage) {
    // Negotiator를 사용하여 Accept-Language 헤더 파싱
    let languages = new Negotiator({
      headers: { 'accept-language': acceptLanguage },
    }).languages();

    // @formatjs/intl-localematcher를 사용하여 최적의 로케일 매칭
    try {
      return match(languages, locales, defaultLocale);
    } catch (error) {
      console.error('Error matching locale:', error);
    }
  }

  // 3. 기본 로케일 반환
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en/products
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
