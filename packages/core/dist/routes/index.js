"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./v1/auth"));
const health_1 = __importDefault(require("./v1/health"));
const example_1 = __importDefault(require("./v1/example"));
const registerRoutes = (app) => {
    app.use("/api/v1/auth", auth_1.default);
    app.use("/api/v1/health", health_1.default);
    app.use("/api/v1/example", example_1.default);
};
exports.default = registerRoutes;
//# sourceMappingURL=index.js.map