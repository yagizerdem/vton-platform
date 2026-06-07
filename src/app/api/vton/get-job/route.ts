import { withErrorHandler } from "@/src/lib/with-error-handler";
import { NextRequest, NextResponse } from "next/server";
import HttpStatusCode from "@/src/lib/http-status-code";
import { ApiResponse } from "@/src/lib/api-response";
import dbConnect from "@/src/lib/mongodb";
import { headers } from "next/headers";
import UserModel from "@/src/models/user";
import { AppError } from "@/src/lib/app-error";
import VtonJobModel from "@/src/models/vton-job";
import { APIFeatures } from "@/src/lib/api-features";

async function handler(req: NextRequest, res: NextResponse) {
  await dbConnect();
  const headerList = await headers();
  const _id = headerList.get("x-user-id");
  //   const username = headerList.get("x-user-username");
  //   const email = headerList.get("x-user-email");

  const userFromDb = await UserModel.findById(_id);

  if (!userFromDb) {
    throw new AppError({
      message: "User not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }

  const searchParams = req.nextUrl.searchParams;
  const allParams = Object.fromEntries(searchParams.entries());

  const query = VtonJobModel.find();

  const apiFeatures = new APIFeatures(query, allParams)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const jobs = await apiFeatures.mongooseQuery;

  const response = NextResponse.json(
    ApiResponse.ok({
      data: jobs,
      message: "jobs fetched successfully!",
    }),
    {
      status: HttpStatusCode.OK,
    },
  );

  return response;
}

export const GET = withErrorHandler(handler);
