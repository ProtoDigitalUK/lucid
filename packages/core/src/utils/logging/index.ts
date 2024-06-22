import winstonLogger from "./logger.js";

export type LogLevel = "error" | "warn" | "info" | "debug";

export enum LoggerScopes {
	CONFIG = "config",
}

const logger = (
	level: LogLevel,
	data: {
		message: string;
		scope?: LoggerScopes | string;
		data?: Record<string, unknown>;
	},
) => {
	let logFn = winstonLogger.error;

	switch (level) {
		case "error":
			logFn = winstonLogger.error;
			break;
		case "warn":
			logFn = winstonLogger.warn;
			break;
		case "info":
			logFn = winstonLogger.info;
			break;
		case "debug":
			logFn = winstonLogger.debug;
			break;
		default:
			logFn = winstonLogger.error;
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

export default logger;
