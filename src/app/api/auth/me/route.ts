import { withErrorHandler } from "@/src/lib/with-error-handler";
import { NextRequest, NextResponse } from "next/server";
import HttpStatusCode from "@/src/lib/http-status-code";
import { ApiResponse } from "@/src/lib/api-response";
import { headers } from "next/headers";

async function handler(req: NextRequest) {
  const headerList = await headers();
  const _id = headerList.get("x-user-id");
  const username = headerList.get("x-user-username");
  const email = headerList.get("x-user-email");

  const response = NextResponse.json(
    ApiResponse.custom({
      status: HttpStatusCode.OK,
      data: {
        _id,
        username,
        email,
      },
      message: "fetch me successfully!",
    }),
    {
      status: HttpStatusCode.OK,
    },
  );

  return response;
}

export const GET = withErrorHandler(handler);
