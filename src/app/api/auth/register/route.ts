import { registerSchema, validateBody } from "@/src/lib/validators";
import UserModel from "@/src/models/user";
import { withErrorHandler } from "@/src/lib/with-error-handler";
import { NextRequest, NextResponse } from "next/server";
import HttpStatusCode from "@/src/lib/http-status-code";
import { ApiResponse } from "@/src/lib/api-response";
import dbConnect from "@/src/lib/mongodb";

async function handler(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  const userData = validateBody(registerSchema, body);
  const userModel = new UserModel({ ...userData });
  await userModel.save();

  return NextResponse.json(
    ApiResponse.created({
      data: null,
      message: "User registered successfully!",
    }),
    {
      status: HttpStatusCode.CREATED,
    },
  );
}

export const POST = withErrorHandler(handler);
