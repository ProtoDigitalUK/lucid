"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../app/error-handler");
const launchSteps = async () => {
    try {
    }
    catch (err) {
        new error_handler_1.RuntimeError(err.message);
    }
};
exports.default = launchSteps;
//# sourceMappingURL=launch-steps.js.map