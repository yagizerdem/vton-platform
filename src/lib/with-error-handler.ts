import { NextRequest, NextResponse } from "next/server";
import HttpStatusCode from "./http-status-code";
import { AppError } from "./app-error";
import { ApiResponse } from "./api-response";
import mongoose from "mongoose";
import { MongoServerError } from "mongodb";

type RouteContext = {
  params: Promise<Record<string, string>>;
};

type RouteHandler = (
  req: NextRequest,
  context: RouteContext,
) => Promise<Response> | Response;

const withErrorHandler = (handler: RouteHandler): RouteHandler => {
  return async (req: NextRequest, context: RouteContext) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error(error);

      if (error instanceof AppError) {
        if (error.isOperational) {
          return NextResponse.json(
            ApiResponse.custom({
              message: error.message,
              status: error.statusCode,
              errors: error.errors,
            }),
            {
              status: error.statusCode,
            },
          );
        }
      }

      if (
        error instanceof mongoose.Error.CastError &&
        error.name === "CastError"
      ) {
        const message = `Invalid ${error.path}: ${error.value}.`;

        return NextResponse.json(
          ApiResponse.custom({
            status: HttpStatusCode.BAD_REQUEST,
            message,
            errors: undefined,
          }),
          { status: HttpStatusCode.BAD_REQUEST },
        );
      }

      if (
        error instanceof mongoose.Error.ValidationError &&
        error.name === "ValidationError"
      ) {
        const errors = Object.values(error.errors).map((el: any) => el.message);

        return NextResponse.json(
          ApiResponse.custom({
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid input data",
            errors,
          }),
          { status: HttpStatusCode.BAD_REQUEST },
        );
      }

      if (
        error instanceof MongoServerError &&
        error.name === "MongoServerError"
      ) {
        switch (error.code) {
          case 11000: {
            const field =
              Object.keys(error.keyPattern ?? error.keyValue ?? {})[0] ??
              "field";
            const value =
              error.message.match(/(["'])(\\?.)*?\1/)?.[0] ?? "field";
            const message = `${field}: ${value} already exists. please use another`;

            return NextResponse.json(
              ApiResponse.custom({
                status: HttpStatusCode.BAD_REQUEST,
                message,
                errors: undefined,
              }),
              { status: HttpStatusCode.BAD_REQUEST },
            );
          }

          case 121: {
            return NextResponse.json(
              ApiResponse.custom({
                status: HttpStatusCode.BAD_REQUEST,
                message: "Document validation failed",
                errors: undefined,
              }),
              { status: HttpStatusCode.BAD_REQUEST },
            );
          }

          case 50:
          case 262: {
            return NextResponse.json(
              ApiResponse.custom({
                status: HttpStatusCode.REQUEST_TIMEOUT,
                message: "Database operation timed out",
                errors: undefined,
              }),
              { status: HttpStatusCode.REQUEST_TIMEOUT },
            );
          }

          case 112: {
            return NextResponse.json(
              ApiResponse.custom({
                status: HttpStatusCode.CONFLICT,
                message: "Write conflict occurred. Please try again.",
                errors: undefined,
              }),
              { status: HttpStatusCode.CONFLICT },
            );
          }

          case 116:
          case 10334: {
            return NextResponse.json(
              ApiResponse.custom({
                status: HttpStatusCode.BAD_REQUEST,
                message: "Document is too large",
                errors: undefined,
              }),
              { status: HttpStatusCode.BAD_REQUEST },
            );
          }

          case 146:
          case 292: {
            return NextResponse.json(
              ApiResponse.custom({
                status: HttpStatusCode.BAD_REQUEST,
                message: "Query used too much memory",
                errors: undefined,
              }),
              { status: HttpStatusCode.BAD_REQUEST },
            );
          }

          case 365: {
            return NextResponse.json(
              ApiResponse.custom({
                status: HttpStatusCode.SERVICE_UNAVAILABLE,
                message: "Database is temporarily unavailable",
                errors: undefined,
              }),
              { status: HttpStatusCode.SERVICE_UNAVAILABLE },
            );
          }

          case 384:
          case 6:
          case 7:
          case 89:
          case 9001: {
            return NextResponse.json(
              ApiResponse.custom({
                status: HttpStatusCode.SERVICE_UNAVAILABLE,
                message: "Database connection error",
                errors: undefined,
              }),
              { status: HttpStatusCode.SERVICE_UNAVAILABLE },
            );
          }

          case 402: {
            return NextResponse.json(
              ApiResponse.custom({
                status: HttpStatusCode.SERVICE_UNAVAILABLE,
                message: "Database resource exhausted",
                errors: undefined,
              }),
              { status: HttpStatusCode.SERVICE_UNAVAILABLE },
            );
          }

          case 449: {
            return NextResponse.json(
              ApiResponse.custom({
                status: HttpStatusCode.TOO_MANY_REQUESTS,
                message: "Too many database requests",
                errors: undefined,
              }),
              { status: HttpStatusCode.TOO_MANY_REQUESTS },
            );
          }
        }
      }
      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
          data: null,
        },
        { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
      );
    }
  };
};

export { withErrorHandler };
export type { RouteHandler };
