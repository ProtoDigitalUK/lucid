/*
  When to use LucidError:
    - When the error is being thrown from a route or middleware

  When to use RuntimeError:
    - When the error is being thorwn internall and outside of a request. Eg: in a migration or launch step
*/

import { Request, Response, NextFunction } from "express";
import z from "zod";
import { red, bgRed } from "console-log-colors";

const DEFAULT_ERROR = {
  name: "Error",
  message: "Something went wrong",
  status: 500,
  errors: null,
};

interface LucidErrorData {
  type: "validation" | "basic";

  name?: string;
  message?: string;
  status?: number;
  zod?: z.ZodError;
  errors?: ErrorResult;
}
interface ErrorResult {
  code?: string;
  message?: string;
  children?: Array<undefined | ErrorResult>;
  [key: string]:
    | Array<undefined | ErrorResult>
    | string
    | undefined
    | ErrorResult;
}

// ------------------------------------
// Error Classes
class LucidError extends Error {
  status: number;
  errors: ErrorResult | null = null;
  constructor(data: LucidErrorData) {
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
const decodeError = (error: Error) => {
  if (error instanceof LucidError) {
    return {
      name: error.name,
      message: error.message,
      status: error.status,
      errors: error.errors,
    };
  }
  return {
    name: DEFAULT_ERROR.name,
    message: error.message,
    status: DEFAULT_ERROR.status,
    errors: DEFAULT_ERROR.errors,
  };
};

const modelErrors = (error: ErrorResult): ErrorResult => {
  return {
    body: error,
  };
};

// ------------------------------------
// Error Handlers
const errorLogger = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, message, status } = decodeError(error);

  console.error(
    red(
      `[${new Date().toISOString()}] ${req.method} ${
        req.path
      } - ${name} ${message} ${status}
      `
    )
  );
  next(error);
};

const errorResponder = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, message, status, errors } = decodeError(error);
  res.status(status).send({
    name,
    message,
    status,
    errors,
  });
};

const invalidPathHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404);
  res.send("invalid path");
};

export {
  LucidError,
  RuntimeError,
  modelErrors,
  errorLogger,
  errorResponder,
  invalidPathHandler,
};
