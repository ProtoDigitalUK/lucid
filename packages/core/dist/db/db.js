"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = __importDefault(require("postgres"));
const Config_1 = __importDefault(require("@db/models/Config"));
const sql = (0, postgres_1.default)(Config_1.default.database_url, {
    ssl: {
        rejectUnauthorized: false,
    },
});
exports.default = sql;
//# sourceMappingURL=db.js.map