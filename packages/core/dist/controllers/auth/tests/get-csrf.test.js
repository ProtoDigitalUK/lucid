"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const dev_1 = require("../../../dev");
const app_1 = __importDefault(require("../../../app"));
const route = "/api/v1/auth/csrf";
describe(`Route: ${route}`, () => {
    test("Success case", async () => {
        const appinstance = await (0, app_1.default)(dev_1.config);
        const res = await (0, supertest_1.default)(appinstance).get(route);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            data: {
                _csrf: expect.any(String),
            },
            meta: {
                path: expect.any(String),
            },
        });
    });
});
//# sourceMappingURL=get-csrf.test.js.map