import { Request, Response, NextFunction } from "express";
import z from "zod";
import { red } from "console-log-colors";

const DEFAULT_ERROR = {
  name: "Error",
  message: "Something went wrong",
  status: 500,
  data: null,
};

// ------------------------------------
// Build/Decode Error
class LucidError extends Error {
  status: number;
  data: ErrorData[] | null = DEFAULT_ERROR.data;
  constructor(data: LucidErrorData) {
    super(data.message || DEFAULT_ERROR.message);

    switch (data.type) {
      case "validation": {
        this.name = "Validation Error";
        this.status = 400;
        this.#formatZodError(data.zod as z.ZodError);
        break;
      }
      case "standard": {
        this.name = data.name || DEFAULT_ERROR.name;
        this.status = data.status || DEFAULT_ERROR.status;
        break;
      }
      default: {
        this.name = DEFAULT_ERROR.name;
        this.status = DEFAULT_ERROR.status;
        break;
      }
    }
  }
  #formatZodError(error: z.ZodError) {
    const errors = error.issues.map((issue): ErrorData => {
      const { path, message, code } = issue;
      let type: ErrorData["type"] = "body";
      switch (path[0]) {
        case "query":
          type = "query";
          break;
        case "params":
          type = "params";
          break;
        case "body":
          type = "body";
          break;
      }
      return {
        type: type,
        field: path[path.length - 1].toString(),
        path: path,
        code: code,
        message: message,
      };
    });
    this.data = errors;
  }
}

const decodeError = (error: Error) => {
  if (error instanceof LucidError) {
    return {
      name: error.name,
      message: error.message,
      status: error.status,
      data: error.data,
    };
  }
  return {
    name: DEFAULT_ERROR.name,
    message: error.message,
    status: DEFAULT_ERROR.status,
    data: DEFAULT_ERROR.data,
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
  const { name, message, status, data } = decodeError(error);

  console.error(
    red(
      `[${new Date().toISOString()}] ${req.method} ${
        req.path
      } - ${name} ${message} ${status} ${data}
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
  const { name, message, status, data } = decodeError(error);
  res.status(status).send({
    name,
    message,
    status,
    data,
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

export { LucidError, errorLogger, errorResponder, invalidPathHandler };
