import "@types/jest";
import request from "supertest";
// import { config } from "@root/dev";
import app from "@root/init";

const route = "/api/v1/auth/csrf";

describe(`Route: ${route}`, () => {
  // test("Success case", async () => {
  //   const appinstance = await app(config);
  //   const res = await request(appinstance).get(route);
  //   expect(res.status).toBe(200);
  //   expect(res.body).toMatchObject({
  //     data: {
  //       _csrf: expect.any(String),
  //     },
  //     meta: {
  //       path: expect.any(String),
  //     },
  //   });
  // });
});
