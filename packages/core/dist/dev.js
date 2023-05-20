"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
index_1.default.start({
    port: 8393,
    origin: "*",
    database_url: process.env.DATABASE_URL,
});
//# sourceMappingURL=dev.js.map