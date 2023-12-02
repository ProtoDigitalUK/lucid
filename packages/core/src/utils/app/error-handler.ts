/*
  When to use HeadlessError:
    - When the error is being thrown from a route or middleware

  When to use RuntimeError:
    - When the error is being thorwn internall and outside of a request. Eg: in a migration or launch step
*/

import z from "zod";
import { bgRed } from "console-log-colors";

const DEFAULT_ERROR = {
  name: "Error",
  message: "Something went wrong",
  status: 500,
  code: null,
  errors: null,
};

interface HeadlessErrorData {
  type: "validation" | "basic" | "forbidden" | "authorisation";

  name?: string;
  message?: string;
  status?: number;
  code?: "csrf";
  zod?: z.ZodError;
  errors?: ErrorResult;
}

export interface FieldErrors {
  brick_id: string | number | undefined;
  group_id: string | number | undefined;
  key: string;
  language_id: number;
  message: string;
}

export interface ErrorResult {
  code?: string;
  message?: string;
  children?: Array<undefined | ErrorResult | null>;

  [key: string]:
    | Array<undefined | ErrorResult | null>
    | string
    | undefined
    | ErrorResult
    | null
    | FieldErrors[];
}

// ------------------------------------
// Error Classes
class HeadlessError extends Error {
  code: HeadlessErrorData["code"] | null = null;
  status: number;
  errors: ErrorResult | null = null;
  constructor(data: HeadlessErrorData) {
    super(data.message || DEFAULT_ERROR.message);

    switch (data.type) {
      case "validation": {
        this.name = "Validation Error";
        this.status = 400;
        this.#formatZodErrors(data.zod?.issues || []);
        break;
      }
      case "basic": {
        this.name = data.name || DEFAULT_ERROR.name;
        this.status = data.status || DEFAULT_ERROR.status;
        this.errors = data.errors || DEFAULT_ERROR.errors;
        break;
      }
      case "authorisation": {
        this.name = "Authorisation Error";
        this.status = 401;
        break;
      }
      case "forbidden": {
        this.name = "Forbidden";
        this.status = 403;
        this.code = data.code || DEFAULT_ERROR.code;
        this.errors = data.errors || DEFAULT_ERROR.errors;
        break;
      }
      default: {
        this.name = DEFAULT_ERROR.name;
        this.status = DEFAULT_ERROR.status;
        this.errors = data.errors || DEFAULT_ERROR.errors;
        break;
      }
    }
  }
  #formatZodErrors(error: z.ZodIssue[]) {
    const result: ErrorResult = {};

    for (const item of error) {
      let current = result;
      for (const key of item.path) {
        if (typeof key === "number") {
          // @ts-ignore
          current = current.children || (current.children = []);
          // @ts-ignore
          current = current[key] || (current[key] = {});
        } else {
          // @ts-ignore
          current = current[key] || (current[key] = {});
        }
      }
      current.code = item.code;
      current.message = item.message;
    }

    this.errors = result || null;
  }
}

class RuntimeError extends Error {
  constructor(message: string) {
    super(message);
    console.error(bgRed(`[RUNTIME ERROR] ${message}`));
  }
}

// ------------------------------------
// Util Functions
export const decodeError = (error: Error) => {
  if (error instanceof HeadlessError) {
    return {
      name: error.name,
      message: error.message,
      status: error.status,
      errors: error.errors,
      code: error.code,
    };
  }
  return {
    name: DEFAULT_ERROR.name,
    message: error.message,
    status: DEFAULT_ERROR.status,
    errors: DEFAULT_ERROR.errors,
    code: DEFAULT_ERROR.code,
  };
};

const modelErrors = (error: ErrorResult): ErrorResult => {
  return {
    body: error,
  };
};

export { HeadlessError, RuntimeError, modelErrors };
