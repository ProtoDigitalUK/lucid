import request from "supertest";
import { config } from "@root/dev";
import app from "@root/app";

const route = "/api/v1/health";

describe(`Route: ${route}`, () => {
  test("Success case", async () => {
    const res = await request(await app(config)).get(route);
    expect(res.body).toContain({
      data: {
        api: "ok",
        db: "ok",
      },
    });
  });
});
