"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LucidError_instances, _LucidError_formatZodErrors;
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidPathHandler = exports.errorResponder = exports.errorLogger = exports.LucidError = void 0;
const console_log_colors_1 = require("console-log-colors");
const DEFAULT_ERROR = {
    name: "Error",
    message: "Something went wrong",
    status: 500,
    errors: null,
};
class LucidError extends Error {
    constructor(data) {
        super(data.message || DEFAULT_ERROR.message);
        _LucidError_instances.add(this);
        this.errors = null;
        switch (data.type) {
            case "validation": {
                this.name = "Validation Error";
                this.status = 400;
                __classPrivateFieldGet(this, _LucidError_instances, "m", _LucidError_formatZodErrors).call(this, data.zod?.issues || []);
                break;
            }
            case "basic": {
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
}
exports.LucidError = LucidError;
_LucidError_instances = new WeakSet(), _LucidError_formatZodErrors = function _LucidError_formatZodErrors(error) {
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
};
const decodeError = (error) => {
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
const errorLogger = (error, req, res, next) => {
    const { name, message, status } = decodeError(error);
    console.error((0, console_log_colors_1.red)(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${name} ${message} ${status}
      `));
    next(error);
};
exports.errorLogger = errorLogger;
const errorResponder = (error, req, res, next) => {
    const { name, message, status, errors } = decodeError(error);
    res.status(status).send({
        name,
        message,
        status,
        errors,
    });
};
exports.errorResponder = errorResponder;
const invalidPathHandler = (error, req, res, next) => {
    res.status(404);
    res.send("invalid path");
};
exports.invalidPathHandler = invalidPathHandler;
//# sourceMappingURL=error-handler.js.map