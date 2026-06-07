import { loginSchema, validateBody } from "@/src/lib/validators";
import { withErrorHandler } from "@/src/lib/with-error-handler";
import { NextRequest, NextResponse } from "next/server";
import HttpStatusCode from "@/src/lib/http-status-code";
import { ApiResponse } from "@/src/lib/api-response";
import dbConnect from "@/src/lib/mongodb";
import UserModel from "@/src/models/user";
import { AppError } from "@/src/lib/app-error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function handler(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const loginData = validateBody(loginSchema, body);

  const userFromDb = await UserModel.findOne({ email: loginData.email });

  if (!userFromDb) {
    throw new AppError({
      message: "Invalid email or password",
      statusCode: HttpStatusCode.UNAUTHORIZED,
      isOperational: true,
    });
  }

  const flag = await bcrypt.compare(loginData.password, userFromDb.password);

  if (!flag) {
    throw new AppError({
      message: "Invalid email or password",
      statusCode: HttpStatusCode.UNAUTHORIZED,
      isOperational: true,
    });
  }

  const token = jwt.sign(
    {
      _id: userFromDb._id,
      email: userFromDb.email,
      username: userFromDb.username,
    },
    process.env.JWT_SECRET_KEY!,
    {
      expiresIn: "60d",
      algorithm: "HS256",
    },
  );

  const response = NextResponse.json(
    ApiResponse.created({
      data: {
        _id: userFromDb._id,
        email: userFromDb.email,
        username: userFromDb.username,
      },
      message: "User logged in successfully!",
    }),
    {
      status: HttpStatusCode.CREATED,
    },
  );

  response.cookies.set("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export const POST = withErrorHandler(handler);
