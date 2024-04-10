import winston from "winston";

const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
});

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple(),
			),
		}),
	);
}

export type LogLevel = "error" | "warn" | "info" | "debug";

const headlessLogger = (
	level: LogLevel,
	data: {
		message: string;
		scope?: string;
	},
) => {
	let logLevelFn = logger.error;

	switch (level) {
		case "error":
			logLevelFn = logger.error;
			break;
		case "warn":
			logLevelFn = logger.warn;
			break;
		case "info":
			logLevelFn = logger.info;
			break;
		case "debug":
			logLevelFn = logger.debug;
			break;
		default:
			logLevelFn = logger.error;
			break;
	}

	if (data.scope) {
		logLevelFn(`[${data.scope}]: ${data.message}`);
	} else {
		logLevelFn(data.message);
	}
};

export default headlessLogger;
