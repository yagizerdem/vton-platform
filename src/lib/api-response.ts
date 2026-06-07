import HttpStatusCode from "./http-status-code";

interface SuccessOptions<T> {
  data: T | null;
  message?: string;
}

interface ErrorOptions {
  message: string;
  errors?: string[];
}

interface CustomOptions<T> {
  status: HttpStatusCode;
  message: string;
  data?: T | null;
  errors?: string[];
}

class ApiResponse<T> {
  status: HttpStatusCode;
  message: string;
  data: T | null;
  errors: string[] | null;

  private constructor({
    status,
    message,
    data = null,
    errors = null,
  }: {
    status: HttpStatusCode;
    message: string;
    data?: T | null;
    errors?: string[] | null;
  }) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  static ok<T>({
    data,
    message = "SUCCESS!",
  }: SuccessOptions<T>): ApiResponse<T> {
    return new ApiResponse<T>({
      status: HttpStatusCode.OK,
      message,
      data,
    });
  }

  static created<T>({
    data,
    message = "CREATED!",
  }: SuccessOptions<T>): ApiResponse<T> {
    return new ApiResponse<T>({
      status: HttpStatusCode.CREATED,
      message,
      data,
    });
  }

  static accepted<T>({
    data,
    message = "ACCEPTED!",
  }: SuccessOptions<T>): ApiResponse<T> {
    return new ApiResponse<T>({
      status: HttpStatusCode.ACCEPTED,
      message,
      data,
    });
  }

  static noContent<T>({
    message = "NO CONTENT!",
  }: { message?: string } = {}): ApiResponse<T> {
    return new ApiResponse<T>({
      status: HttpStatusCode.NO_CONTENT,
      message,
      data: null,
    });
  }

  static badRequest({ message, errors }: ErrorOptions): ApiResponse<null> {
    return this.error({
      status: HttpStatusCode.BAD_REQUEST,
      message,
      errors,
    });
  }

  static unauthorized({ message, errors }: ErrorOptions): ApiResponse<null> {
    return this.error({
      status: HttpStatusCode.UNAUTHORIZED,
      message,
      errors,
    });
  }

  static forbidden({ message, errors }: ErrorOptions): ApiResponse<null> {
    return this.error({
      status: HttpStatusCode.FORBIDDEN,
      message,
      errors,
    });
  }

  static notFound({ message, errors }: ErrorOptions): ApiResponse<null> {
    return this.error({
      status: HttpStatusCode.NOT_FOUND,
      message,
      errors,
    });
  }

  static conflict({ message, errors }: ErrorOptions): ApiResponse<null> {
    return this.error({
      status: HttpStatusCode.CONFLICT,
      message,
      errors,
    });
  }

  static unprocessableEntity({
    message,
    errors,
  }: ErrorOptions): ApiResponse<null> {
    return this.error({
      status: HttpStatusCode.UNPROCESSABLE_ENTITY,
      message,
      errors,
    });
  }

  static tooManyRequests({ message, errors }: ErrorOptions): ApiResponse<null> {
    return this.error({
      status: HttpStatusCode.TOO_MANY_REQUESTS,
      message,
      errors,
    });
  }

  static internalServerError({
    message,
    errors,
  }: ErrorOptions): ApiResponse<null> {
    return this.error({
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message,
      errors,
    });
  }

  static serviceUnavailable({
    message,
    errors,
  }: ErrorOptions): ApiResponse<null> {
    return this.error({
      status: HttpStatusCode.SERVICE_UNAVAILABLE,
      message,
      errors,
    });
  }

  static fail({ message, errors = [] }: ErrorOptions): ApiResponse<null> {
    return new ApiResponse<null>({
      status: HttpStatusCode.BAD_REQUEST,
      message,
      data: null,
      errors,
    });
  }

  static custom<T>({
    status,
    message,
    data = null,
    errors,
  }: CustomOptions<T>): ApiResponse<T> {
    return new ApiResponse<T>({
      status,
      message,
      data,
      errors: errors ?? null,
    });
  }

  private static error({
    status,
    message,
    errors,
  }: ErrorOptions & { status: HttpStatusCode }): ApiResponse<null> {
    return new ApiResponse<null>({
      status,
      message,
      data: null,
      errors: errors ?? null,
    });
  }
}

export { ApiResponse };
export type { SuccessOptions, ErrorOptions, CustomOptions };
