import HttpStatusCode from "./http-status-code";

interface AppErrorOptions {
  message: string;
  statusCode?: number;
  errors?: string[] | undefined;
  isOperational?: boolean;
}

class AppError extends Error {
  statusCode: number;
  errors: string[] | undefined;
  isOperational: boolean;
  success: boolean;
  status: "fail" | "error";

  constructor({
    message,
    statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
    errors = undefined,
    isOperational = true,
  }: AppErrorOptions) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    this.success = false;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export { AppError };
export type { AppErrorOptions };
