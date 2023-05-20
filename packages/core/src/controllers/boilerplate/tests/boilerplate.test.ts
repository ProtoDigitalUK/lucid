import request from "supertest";
import { config } from "@root/dev";
import app from "@root/app";

const route = "/api/v1/example/boilerplate";

describe(`Route: ${route}`, () => {
  test("Success case", async () => {
    const res = await request(await app(config)).get(route);
    expect(res.body).toEqual({});
  });
});
