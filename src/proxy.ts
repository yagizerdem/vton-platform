// src/proxy.ts

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ApiResponse } from "./lib/api-response";
import HttpStatusCode from "./lib/http-status-code";

const protectedRoutes = [
  "/api/auth/me",
  "/api/vton/try-on",
  "/api/vton/add-api-key",
];

type AuthJwtPayload = {
  _id: string;
  username: string;
  email: string;
};

function jsonUnauthorized(message = "Unauthorized") {
  return NextResponse.json(
    ApiResponse.custom({
      message,
      status: HttpStatusCode.UNAUTHORIZED,
      data: null,
    }),
    {
      status: HttpStatusCode.UNAUTHORIZED,
    },
  );
}

async function authHandler(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get("jwt")?.value;

  if (!token) {
    return jsonUnauthorized("Authentication token is missing");
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    const { _id, username, email } = payload as AuthJwtPayload;

    const requestHeaders = new Headers(req.headers);

    requestHeaders.set("x-user-id", String(_id));
    requestHeaders.set("x-user-email", String(email));
    requestHeaders.set("x-user-username", String(username));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    return jsonUnauthorized("Invalid or expired token");
  }
}

export default async function proxy(req: NextRequest) {
  return authHandler(req);
}

export const config = {
  matcher: ["/api/auth/me", "/api/vton/try-on", "/api/vton/add-api-key"],
};
