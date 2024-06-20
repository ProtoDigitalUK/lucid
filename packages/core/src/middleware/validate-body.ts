import T from "../translations/index.js";
import type { FastifyRequest } from "fastify";
import z, { type ZodTypeAny } from "zod";
import { LucidAPIError } from "../utils/errors/index.js";

const validateBody =
	(schema: ZodTypeAny, isMultipart?: boolean) =>
	async (request: FastifyRequest) => {
		let bodyData = request.body || {};

		if (isMultipart) {
			try {
				const queryObject = request.query as Record<
					string,
					string | undefined
				>;
				if (queryObject.body) bodyData = JSON.parse(queryObject.body);
			} catch (error) {
				throw new LucidAPIError({
					type: "validation",
					message: T("multipart_body_validation_error_message"),
				});
			}
		}

		const bodySchema = z.object({
			body: schema ?? z.object({}),
		});
		const validateResult = await bodySchema.safeParseAsync({
			body: bodyData,
		});

		if (!validateResult.success) {
			throw new LucidAPIError({
				type: "validation",
				message: T("validation_body_error_message"),
				zod: validateResult.error,
			});
		}

		request.body = validateResult.data.body;
	};

export default validateBody;
