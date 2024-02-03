import T from "../translations/index.js";
import { type FastifyRequest } from "fastify";
import z, { type ZodTypeAny } from "zod";
import { APIError } from "../utils/app/error-handler.js";

const validateBody =
	(schema: ZodTypeAny) => async (request: FastifyRequest) => {
		const bodySchema = z.object({
			body: schema ?? z.object({}),
		});
		const validateResult = await bodySchema.safeParseAsync({
			body: request.body,
		});

		if (!validateResult.success) {
			throw new APIError({
				type: "validation",
				message: T("validation_body_error_message"),
				zod: validateResult.error,
			});
		}

		request.body = validateResult.data.body;
	};

export default validateBody;
