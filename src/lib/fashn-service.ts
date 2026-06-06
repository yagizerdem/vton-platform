import Fashn from "fashn";
import { AppError } from "./app-error";
import HttpStatusCode from "./http-status-code";

export default async function runGeneration(
  modelImage: string, // base64 string
  garmentImage: string, // base64 string
  fashnApiKey: string,
) {
  try {
    const client = new Fashn({ apiKey: fashnApiKey });
    const response = await client.predictions.subscribe({
      model_name: "tryon-v1.6",
      inputs: {
        model_image: modelImage,
        garment_image: garmentImage,
        category: "auto",
        mode: "balanced",
        return_base64: false,
      },
    });

    // 1. Check for Runtime Errors (during model execution). Status can be failed, canceled or time_out.
    if (response.status !== "completed") {
      throw new AppError({
        message: `Fashn Generation Error: Status is ${response.status}`,
        statusCode: HttpStatusCode.BAD_GATEWAY,
        isOperational: true,
      });
    }

    // 2. Success case (status is completed)
    return { output: response.output?.at(0) };
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      throw error; // Re-throw if it's already an AppError
    }

    // 3. Handle API-Level Errors (before request processing)
    if (error instanceof Fashn.APIError) {
      throw new AppError({
        message: `Fashn API Error: ${error.message}`,
        statusCode: HttpStatusCode.BAD_GATEWAY,
        isOperational: true,
      });
    } else {
      throw new AppError({
        message: "Network or unexpected error",
        statusCode: HttpStatusCode.BAD_GATEWAY,
        isOperational: true,
      });
    }
  }
}
