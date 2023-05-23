"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("@utils/error-handler");
const User_1 = __importDefault(require("@db/models/User"));
const Option_1 = __importDefault(require("@db/models/Option"));
const Permission_1 = __importDefault(require("@db/models/Permission"));
const createFixOptions = async () => {
    await Option_1.default.create({
        name: "initial_user_created",
        value: true,
        type: "boolean",
        locked: true,
    });
};
const createInitialAdmin = async () => {
    const res = await Option_1.default.getByName("initial_user_created");
    if (typeof res.option_value === "boolean" && res.option_value)
        return;
    try {
        const user = await User_1.default.register({
            email: "admin@example.com",
            username: "admin",
            password: "admin",
        });
        await Permission_1.default.set(user.id, "admin");
        await Option_1.default.patchByName({
            name: "initial_user_created",
            value: true,
            type: "boolean",
            locked: true,
        });
    }
    catch (err) {
        await Option_1.default.patchByName({
            name: "initial_user_created",
            value: true,
            type: "boolean",
            locked: true,
        });
    }
};
const launchSteps = async () => {
    try {
        await createFixOptions();
        await createInitialAdmin();
    }
    catch (err) {
        new error_handler_1.RuntimeError(err.message);
    }
};
exports.default = launchSteps;
//# sourceMappingURL=launch-steps.js.map