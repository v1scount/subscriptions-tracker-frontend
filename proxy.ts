import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { auth } from "./auth";

export const locales = ["en", "es"];
export const defaultLocale = "en";

function getLocale(request: NextRequest): string {
  // 1. Check if the NEXT_LOCALE cookie is set
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Negotiator expects plain object for headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Filter out invalid language tags like '*' which cause Intl.getCanonicalLocales to fail
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const validLanguages = languages.filter((lang) => lang !== "*");

  try {
    return match(validLanguages, locales, defaultLocale);
  } catch (error) {
    return defaultLocale;
  }
}


export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;
  
  // 1. Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 2. Redirect if there is no locale
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // 3. Authentication logic
  // The session is available as request.auth
  const isLoggedIn = !!request.auth;
  const isDashboardRoute = pathname.includes("/dashboard");
  const isAuthRoute = pathname.includes("/auth");

  // We can extract the locale from the pathname since we know it has one at this point
  const locale = pathname.split("/")[1];

  // Redirect to signin if accessing dashboard while logged out
  if (isDashboardRoute && !isLoggedIn) {
    const signinUrl = new URL(`/${locale}/auth/signin`, request.nextUrl);
    signinUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(signinUrl);
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip all internal paths (_next), API routes, and static files with extensions
    "/((?!_next|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt)).*)",
  ],
};
