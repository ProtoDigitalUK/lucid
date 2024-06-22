import winston from "winston";

const winstonLogger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
});

if (process.env.NODE_ENV !== "production") {
	winstonLogger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple(),
			),
		}),
	);
}

export default winstonLogger;
