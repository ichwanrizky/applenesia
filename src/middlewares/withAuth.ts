import { getToken } from "next-auth/jwt";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

export default function withAuth(
  middleware: NextMiddleware,
  requireAuth: string[] = []
) {
  return async function (req: NextRequest, next: NextFetchEvent) {
    const pathname = req.nextUrl.pathname;

    const token = await getToken({
      req,
      secret: process.env.JWT,
    });

    if (pathname === "/cp" && token) {
      return NextResponse.redirect(new URL("/cp/redirect", req.url));
    }

    const authenticationRequired = requireAuth.some((path) =>
      pathname.startsWith(path)
    );

    if (authenticationRequired) {
      if (!token) {
        const url = new URL(`/cp`, req.url);
        url.searchParams.set("callbackUrl", encodeURI(pathname));
        return NextResponse.redirect(url);
      }

      return middleware(req, next);
    }
  };
}
