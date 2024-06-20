import logger from "./logger.js";

export type LogLevel = "error" | "warn" | "info" | "debug";

export enum LoggerScopes {
	CONFIG = "config",
}

const lucidLogger = (
	level: LogLevel,
	data: {
		message: string;
		scope?: LoggerScopes | string;
		data?: Record<string, unknown>;
	},
) => {
	let logFn = logger.error;

	switch (level) {
		case "error":
			logFn = logger.error;
			break;
		case "warn":
			logFn = logger.warn;
			break;
		case "info":
			logFn = logger.info;
			break;
		case "debug":
			logFn = logger.debug;
			break;
		default:
			logFn = logger.error;
			break;
	}

	logFn(messageFormat(data), data.data);
};

export const messageFormat = (data: {
	message: string;
	scope?: LoggerScopes | string;
}) => {
	if (data.scope) {
		return `[${data.scope}]: ${data.message}`;
	}

	return data.message;
};

export default lucidLogger;
