import { withErrorHandler } from "@/src/lib/with-error-handler";
import { NextRequest, NextResponse } from "next/server";
import HttpStatusCode from "@/src/lib/http-status-code";
import { ApiResponse } from "@/src/lib/api-response";

async function handler(req: NextRequest) {
  const response = NextResponse.json(
    ApiResponse.custom({
      status: HttpStatusCode.OK,
      data: null,
      message: "User logged out successfully!",
    }),
    {
      status: HttpStatusCode.OK,
    },
  );

  response.cookies.set("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export const POST = withErrorHandler(handler);
