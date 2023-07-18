import { Setter } from "solid-js";

export class LucidError extends Error {
  errorRes: APIErrorResponse;
  constructor(message: string, errorRes: APIErrorResponse) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.errorRes = errorRes;
  }
}

export const validateSetError = (
  error: any,
  setErrors: Setter<APIErrorResponse | null>
) => {
  if (error instanceof LucidError) {
    setErrors(error.errorRes);
  } else {
    setErrors({
      status: 500,
      name: "Error",
      message: "An unknown error occurred.",
      errors: {},
    });
  }
  return;
};
