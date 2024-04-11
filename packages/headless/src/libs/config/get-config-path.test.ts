import { expect, test } from "vitest";
import getConfigPath from "./get-config-path.js";

test("finds headless.test.config.ts file", async () => {
	const configPath = getConfigPath(process.cwd(), "headless.test.config");
	expect(configPath).toContain("headless.test.config.ts");
});

test("throws on missing file", async () => {
	expect(() => getConfigPath(process.cwd(), "test.cfdonfig")).toThrowError(
		/^Cannot find the headless.config.ts or headless.config.js file at the root of your project.$/,
	);
});
