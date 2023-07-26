"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../utils/app/service"));
const users_1 = __importDefault(require("./users"));
const Initialise = async (client) => {
    const users = await (0, service_1.default)(users_1.default.getMultiple, false, client)({
        query: {},
    });
    if (users.count === 0) {
        await (0, service_1.default)(users_1.default.registerSingle, false, client)({
            first_name: "Lucid",
            last_name: "Admin",
            email: "admin@lucid.com",
            username: "admin",
            password: "password",
            super_admin: true,
        });
    }
};
exports.default = Initialise;
//# sourceMappingURL=Initialise.js.map