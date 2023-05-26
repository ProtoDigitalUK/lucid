"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routes_1 = __importDefault(require("./v1/auth.routes"));
const health_routes_1 = __importDefault(require("./v1/health.routes"));
const bricks_routes_1 = __importDefault(require("./v1/bricks.routes"));
const initRoutes = (app) => {
    app.use("/api/v1/auth", auth_routes_1.default);
    app.use("/api/v1/health", health_routes_1.default);
    app.use("/api/v1/bricks", bricks_routes_1.default);
};
exports.default = initRoutes;
//# sourceMappingURL=index.js.map