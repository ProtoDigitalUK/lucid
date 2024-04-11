import { expect, test } from "vitest";
import path from "node:path";
import getConfig from "./get-config.js";

test("should return valid config", async () => {
	const config = await getConfig(
		path.resolve(__dirname, "./mock-config/headless.config.ts"),
	);

	expect(typeof config).toBe("object");
	expect(config).toBeDefined();
});
