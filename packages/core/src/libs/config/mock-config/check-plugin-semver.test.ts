import { expect, test, vi } from "vitest";
import T from "../../../translations/index.js";
import path from "node:path";
import getConfig from "../get-config.js";
import logger from "../../logging/logger.js";
import { messageFormat } from "../../logging/index.js";
import packageJson from "../../../../package.json";

test("should throw headless version support error", async () => {
	const consoleLogSpy = vi
		.spyOn(logger, "error")
		// @ts-expect-error
		.mockImplementation(() => {});

	const processExitSpy = vi
		.spyOn(process, "exit")
		// @ts-expect-error
		.mockImplementation(() => {});

	await getConfig(path.resolve(__dirname, "./check-plugin-semver.ts"));

	expect(consoleLogSpy).toHaveBeenCalledWith(
		messageFormat({
			scope: "plugin-testing",
			message: T("plugin_version_not_supported", {
				version: packageJson.version,
				supportedVersions: "100.0.0",
			}),
		}),
		undefined,
	);
	expect(processExitSpy).toHaveBeenCalledWith(1);
	processExitSpy.mockRestore();
	consoleLogSpy.mockRestore();
});
