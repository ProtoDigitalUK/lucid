"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class Migration {
    constructor() { }
    static async all() {
        try {
            const migrations = await (0, db_1.default) `SELECT * FROM migrations`;
            return migrations;
        }
        catch (err) {
            return [];
        }
    }
}
exports.default = Migration;
//# sourceMappingURL=Migration.js.map