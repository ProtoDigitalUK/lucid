"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidPathHandler = exports.errorResponder = exports.errorLogger = exports.modelErrors = exports.RuntimeError = exports.LucidError = exports.decodeError = void 0;
const console_log_colors_1 = require("console-log-colors");
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
exports.LucidError = LucidError;
class RuntimeError extends Error {
    constructor(message) {
        super(message);
        console.error((0, console_log_colors_1.bgRed)(`[RUNTIME ERROR] ${message}`));
    }
}
exports.RuntimeError = RuntimeError;
const decodeError = (error) => {
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
exports.decodeError = decodeError;
const modelErrors = (error) => {
    return {
        body: error,
    };
};
exports.modelErrors = modelErrors;
const errorLogger = (error, req, res, next) => {
    const { message, status } = (0, exports.decodeError)(error);
    console.error((0, console_log_colors_1.red)(`${status} - ${message}`));
    next(error);
};
exports.errorLogger = errorLogger;
const errorResponder = (error, req, res, next) => {
    const { name, message, status, errors, code } = (0, exports.decodeError)(error);
    const response = Object.fromEntries(Object.entries({
        code,
        status,
        name,
        message,
        errors,
    }).filter(([_, value]) => value !== null));
    res.status(status).send(response);
};
exports.errorResponder = errorResponder;
const invalidPathHandler = (error, req, res, next) => {
    res.status(404);
    res.send("invalid path");
};
exports.invalidPathHandler = invalidPathHandler;
//# sourceMappingURL=error-handler.js.map