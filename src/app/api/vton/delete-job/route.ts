import { withErrorHandler } from "@/src/lib/with-error-handler";
import { NextRequest, NextResponse } from "next/server";
import HttpStatusCode from "@/src/lib/http-status-code";
import { ApiResponse } from "@/src/lib/api-response";
import dbConnect from "@/src/lib/mongodb";
import { headers } from "next/headers";
import UserModel from "@/src/models/user";
import { AppError } from "@/src/lib/app-error";
import VtonJobModel from "@/src/models/vton-job";

async function handler(req: NextRequest, res: NextResponse) {
  await dbConnect();
  const headerList = await headers();
  const user_id = headerList.get("x-user-id");

  const userFromDb = await UserModel.findById(user_id);

  if (!userFromDb) {
    throw new AppError({
      message: "User not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }

  const jobId = req.nextUrl.searchParams.get("jobId");

  if (!jobId) {
    throw new AppError({
      message: "Job id is required",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  const vtonJob = await VtonJobModel.findOneAndDelete({
    jobId,
    userId: user_id,
  });

  if (!vtonJob) {
    throw new AppError({
      message: "Job not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }

  const response = NextResponse.json(
    ApiResponse.ok({
      data: vtonJob,
      message: "Job deleted successfully!",
    }),
    {
      status: HttpStatusCode.OK,
    },
  );

  return response;
}

export const DELETE = withErrorHandler(handler);
