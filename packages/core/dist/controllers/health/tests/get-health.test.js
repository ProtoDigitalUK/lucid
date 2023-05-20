"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const dev_1 = require("../../../dev");
const app_1 = __importDefault(require("../../../app"));
const route = "/api/v1/health";
describe(`Route: ${route}`, () => {
    test("Success case", async () => {
        const res = await (0, supertest_1.default)(await (0, app_1.default)(dev_1.config)).get(route);
        expect(res.body).toEqual({
            health: {
                api: "ok",
                db: "ok",
            },
        });
    });
});
//# sourceMappingURL=get-health.test.js.map