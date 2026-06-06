export const maxDuration = 40;

import { withErrorHandler } from "@/src/lib/with-error-handler";
import { NextRequest, NextResponse } from "next/server";
import HttpStatusCode from "@/src/lib/http-status-code";
import { ApiResponse } from "@/src/lib/api-response";
import dbConnect from "@/src/lib/mongodb";
import { headers } from "next/headers";
import UserModel from "@/src/models/user";
import { AppError } from "@/src/lib/app-error";
import VtonJobModel from "@/src/models/vton-job";

type FashnWebhookStatus = "completed" | "failed" | "canceled" | "time_out";

type FashnWebhookError = {
  name: string;
  message: string;
};

type FashnWebhookSuccessPayload = {
  id: string;
  status: "completed";
  output: string[];
  error: null;
};

type FashnWebhookErrorPayload = {
  id: string;
  status: Exclude<FashnWebhookStatus, "completed">;
  output?: undefined;
  error: FashnWebhookError;
};

type FashnWebhookPayload =
  | FashnWebhookSuccessPayload
  | FashnWebhookErrorPayload;

async function handler(req: NextRequest, res: NextResponse) {
  await dbConnect();
  const body: FashnWebhookPayload = await req.json();

  // find job from db

  const job = await VtonJobModel.findOne({ jobId: body.id });
  if (!job) {
    throw new AppError({
      message: "Job not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }

  if (body.status === "completed") {
    job.status = "completed";
    job.resultImageUrl = body.output.at(0) || "";
  }

  if (body.status === "failed") {
    job.status = "failed";
    job.errorMessage = body.error.message;
  }

  await job.save();

  const response = NextResponse.json(
    ApiResponse.created({
      data: null,
      message: "OK",
    }),
    {
      status: HttpStatusCode.OK,
    },
  );

  return response;
}

export const POST = withErrorHandler(handler);
