import { withErrorHandler } from "@/src/lib/with-error-handler";
import {
  addApiKeySchema,
  encryptText,
  validateBody,
} from "@/src/lib/validators";
import { NextRequest, NextResponse } from "next/server";
import HttpStatusCode from "@/src/lib/http-status-code";
import { ApiResponse } from "@/src/lib/api-response";
import dbConnect from "@/src/lib/mongodb";
import { headers } from "next/headers";
import UserModel from "@/src/models/user";
import { AppError } from "@/src/lib/app-error";

async function handler(req: NextRequest, res: NextResponse) {
  await dbConnect();
  const headerList = await headers();
  const _id = headerList.get("x-user-id");

  const body = await req.json();
  const { fashnApiKey } = validateBody(addApiKeySchema, body);

  const userFromDb = await UserModel.findById(_id);

  if (!userFromDb) {
    throw new AppError({
      message: "User not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }

  const encryptedApiKey = encryptText(fashnApiKey);
  userFromDb.fashnApiKey = encryptedApiKey;
  await userFromDb.save();

  const response = NextResponse.json(
    ApiResponse.created({
      data: null,
      message: "API key added successfully!",
    }),
    {
      status: HttpStatusCode.CREATED,
    },
  );

  return response;
}

export const POST = withErrorHandler(handler);
