import request from "supertest";
import { config } from "@root/dev";
import app from "@root/app";

describe("Route: /api/v1/health", () => {
  test("Success case", async () => {
    const res = await request(await app(config)).get("/api/v1/health");
    expect(res.body).toEqual({
      health: {
        api: "ok",
        db: "ok",
      },
    });
  });
});
