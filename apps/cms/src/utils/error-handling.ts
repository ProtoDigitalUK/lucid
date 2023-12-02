import T from "@/translations";
import spawnToast from "@/utils/spawn-toast";
// Types
import { APIErrorResponse } from "@/types/api";

export class HeadlessError extends Error {
  errorRes: APIErrorResponse;
  constructor(message: string, errorRes: APIErrorResponse) {
    super(message);
    this.name = this.constructor.name;
    // Error.captureStackTrace(this, this.constructor);
    this.errorRes = errorRes;
  }
}

export const validateSetError = (error: unknown) => {
  if (error instanceof HeadlessError) {
    return error.errorRes;
  } else {
    return {
      status: 500,
      name: T("error"),
      message: T("unknown_error_message"),
      errors: {},
    };
  }
};

export const handleSiteErrors = (error: APIErrorResponse) => {
  spawnToast({
    title: error.name,
    message: error.message,
    status: "error",
  });
};

export const emptyBodyError = () => {
  spawnToast({
    title: T("error"),
    message: T("empty_body_error_message"),
    status: "error",
  });
};
