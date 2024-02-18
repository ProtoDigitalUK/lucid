import T from "../translations/index.js";
import { type FastifyRequest } from "fastify";
import { type MultipartFile } from "@fastify/multipart";
import z, { type ZodTypeAny } from "zod";
import { APIError } from "../utils/app/error-handler.js";

function isFile(part: unknown): part is MultipartFile {
	return (part as MultipartFile).file !== undefined;
}

const validateBody =
	(schema: ZodTypeAny, isMultipart?: boolean) =>
	async (request: FastifyRequest) => {
		let bodyData = request.body;

		if (isMultipart) {
			const parts = request.parts();
			for await (const part of parts) {
				if (isFile(part)) part.file.resume();
				else {
					if (part.fieldname === "body") {
						try {
							bodyData = JSON.parse(part.value as string);
						} catch (error) {
							throw new APIError({
								type: "validation",
								message: T(
									"multipart_body_validation_error_message",
								),
							});
						}
					}
				}
			}
		}

		const bodySchema = z.object({
			body: schema ?? z.object({}),
		});
		const validateResult = await bodySchema.safeParseAsync({
			body: bodyData,
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
