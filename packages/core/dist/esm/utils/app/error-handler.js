import { red, bgRed } from "console-log-colors";
const DEFAULT_ERROR = {
    name: "Error",
    message: "Something went wrong",
    status: 500,
    code: null,
    errors: null,
};
class LucidError extends Error {
    code = null;
    status;
    errors = null;
    constructor(data) {
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
    #formatZodErrors(error) {
        const result = {};
        for (const item of error) {
            let current = result;
            for (const key of item.path) {
                if (typeof key === "number") {
                    current = current.children || (current.children = []);
                    current = current[key] || (current[key] = {});
                }
                else {
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
    constructor(message) {
        super(message);
        console.error(bgRed(`[RUNTIME ERROR] ${message}`));
    }
}
export const decodeError = (error) => {
    if (error instanceof LucidError) {
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
const modelErrors = (error) => {
    return {
        body: error,
    };
};
const errorLogger = (error, req, res, next) => {
    const { message, status } = decodeError(error);
    console.error(red(`${status} - ${message}`));
    next(error);
};
const errorResponder = (error, req, res, next) => {
    const { name, message, status, errors, code } = decodeError(error);
    const response = Object.fromEntries(Object.entries({
        code,
        status,
        name,
        message,
        errors,
    }).filter(([_, value]) => value !== null));
    res.status(status).send(response);
};
const invalidPathHandler = (error, req, res, next) => {
    res.status(404);
    res.send("invalid path");
};
export { LucidError, RuntimeError, modelErrors, errorLogger, errorResponder, invalidPathHandler, };
//# sourceMappingURL=error-handler.js.map