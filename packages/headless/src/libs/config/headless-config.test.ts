import { expect, test, vi } from "vitest";
import T from "../../translations/index.js";
import path from "node:path";
import getConfig from "./get-config.js";
import logger from "../logging/logger.js";
import { messageFormat, LoggerScopes } from "../logging/index.js";

test("should throw duplicate collection error", async () => {
	const consoleLogSpy = vi
		.spyOn(logger, "error")
		// @ts-ignore
		.mockImplementation(() => {});

	const processExitSpy = vi
		.spyOn(process, "exit")
		// @ts-ignore
		.mockImplementation(() => {});

	await getConfig(
		path.resolve(
			__dirname,
			"./mock-config/duplicate-collections.config.ts",
		),
	);

	expect(consoleLogSpy).toHaveBeenCalledWith(
		messageFormat({
			scope: LoggerScopes.CONFIG,
			message: T("config_duplicate_keys", { builder: "collections" }),
		}),
		undefined,
	);
	expect(processExitSpy).toHaveBeenCalledWith(1);
	processExitSpy.mockRestore();
	consoleLogSpy.mockRestore();
});
