import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in and trying to access /journal → redirect to /auth
  if (!user && request.nextUrl.pathname.startsWith("/journal")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // If logged in and on /auth → redirect to /journal
  if (user && request.nextUrl.pathname === "/auth") {
    return NextResponse.redirect(new URL("/journal", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/journal/:path*", "/auth"],
};