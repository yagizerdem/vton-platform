import { withErrorHandler } from "@/src/lib/with-error-handler";
import { NextRequest, NextResponse } from "next/server";
import HttpStatusCode from "@/src/lib/http-status-code";
import { ApiResponse } from "@/src/lib/api-response";
import dbConnect from "@/src/lib/mongodb";
import { headers } from "next/headers";
import UserModel from "@/src/models/user";
import { AppError } from "@/src/lib/app-error";
import { v4 as uuidv4 } from "uuid";
import { bufferToBase64, saveLocalFile } from "@/src/lib/upload-service";
import Fashn from "fashn";
import runGeneration from "@/src/lib/fashn-service";

async function handler(req: NextRequest, res: NextResponse) {
  await dbConnect();
  const formData = await req.formData();
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

  const fashnApiKey = userFromDb?.fashnApiKey;

  if (!fashnApiKey) {
    throw new AppError({
      message: "Fashn API key not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }

  const personImage = formData.get("personImage");
  const garmentImage = formData.get("garmentImage");

  if (!(personImage instanceof File)) {
    throw new AppError({
      message: "personImage is required",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  if (!(garmentImage instanceof File)) {
    throw new AppError({
      message: "garmentImage is required",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  const personBuffer = Buffer.from(await personImage.arrayBuffer());
  const garmentBuffer = Buffer.from(await garmentImage.arrayBuffer());
  const personBase64 = bufferToBase64(personBuffer, personImage.type);
  const garmentBase64 = bufferToBase64(garmentBuffer, garmentImage.type);

  const personFileName = `${uuidv4()}.${personImage.type.split("/")[1]}`;
  const garmentFileName = `${uuidv4()}.${garmentImage.type.split("/")[1]}`;
  await saveLocalFile(personFileName, personBuffer);
  await saveLocalFile(garmentFileName, garmentBuffer);

  const output = await runGeneration(personBase64, garmentBase64, fashnApiKey);

  console.log("Fashn API Output:", output);
  //   console.log({
  //     personName: personImage.name,
  //     personType: personImage.type,
  //     personSize: personImage.size,

  //     garmentName: garmentImage.name,
  //     garmentType: garmentImage.type,
  //     garmentSize: garmentImage.size,
  //   });

  const response = NextResponse.json(
    ApiResponse.created({
      data: output,
      message: "Try on successfully!",
    }),
    {
      status: HttpStatusCode.CREATED,
    },
  );

  return response;
}

export const POST = withErrorHandler(handler);
