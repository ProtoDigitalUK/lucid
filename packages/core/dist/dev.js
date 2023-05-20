"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const index_1 = __importDefault(require("./index"));
exports.config = {
    port: 8393,
    origin: "*",
    database_url: process.env.DATABASE_URL,
};
index_1.default.start(exports.config);
//# sourceMappingURL=dev.js.map