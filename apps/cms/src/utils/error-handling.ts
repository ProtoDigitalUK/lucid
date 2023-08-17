import T from "@/translations";
import { Setter } from "solid-js";
import spawnToast from "@/utils/spawn-toast";
// Types
import { APIErrorResponse } from "@/types/api";

export class LucidError extends Error {
  errorRes: APIErrorResponse;
  constructor(message: string, errorRes: APIErrorResponse) {
    super(message);
    this.name = this.constructor.name;
    // Error.captureStackTrace(this, this.constructor);
    this.errorRes = errorRes;
  }
}

export const validateSetError = (
  error: any,
  setErrors: Setter<APIErrorResponse | undefined>
) => {
  if (error instanceof LucidError) {
    setErrors(error.errorRes);
  } else {
    setErrors({
      status: 500,
      name: T("error"),
      message: T("unknown_error_message"),
      errors: {},
    });
  }
  return;
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
