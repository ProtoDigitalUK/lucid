import { DEFAULT_MIME_TYPES } from "../constants.js";
import type { FastifyInstance } from "fastify";

const registerContentTypeParser = (
	fastify: FastifyInstance,
	givenMimeTypes?: string[],
) => {
	if (givenMimeTypes) {
		for (const mimeType of givenMimeTypes) {
			fastify.addContentTypeParser(
				mimeType,
				{ parseAs: "buffer" },
				(_, body, done) => {
					done(null, body);
				},
			);
		}
	} else {
		for (const mimeType of DEFAULT_MIME_TYPES) {
			fastify.addContentTypeParser(
				mimeType,
				{ parseAs: "buffer" },
				(_, body, done) => {
					done(null, body);
				},
			);
		}
	}
};

export default registerContentTypeParser;
