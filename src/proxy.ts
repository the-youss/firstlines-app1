import { NextRequest, NextResponse } from "next/server";
import { appRoutes } from "./app-routes";
import { authClient, AuthClient } from "./lib/auth/client";

export async function proxy(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  let session: AuthClient | null = null;
  try {
    const cookie = request.cookies.toString()
    session = (await authClient.getSession({
      fetchOptions: { headers: { cookie }, },
    })).data;
  } catch (error: any) {
    console.log('[proxy] error', error.message)
  }
  console.log("from proxy", session?.user.email)

  const isAuthenticated = Boolean(session);
  const isAuthRoute = pathname.startsWith("/auth");

  if (!isAuthenticated && !isAuthRoute) {
    const loginUrl = new URL("/auth/login", origin);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    const from = request.nextUrl.searchParams.get("redirect") || appRoutes.appDashboard
    return NextResponse.redirect(new URL(from, origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|img).*)"],
};