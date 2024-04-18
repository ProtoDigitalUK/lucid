import T from "../../translations/index.js";
import emailsSchema from "../../schemas/email.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import emailServices from "../../services/email/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import EmailsFormatter from "../../libs/formatters/emails.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const getMultipleController: RouteController<
	typeof emailsSchema.getMultiple.params,
	typeof emailsSchema.getMultiple.body,
	typeof emailsSchema.getMultiple.query
> = async (request, reply) => {
	try {
		const emails = await serviceWrapper(emailServices.getMultiple, false)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				query: request.query,
			},
		);

		reply.status(200).send(
			await buildResponse(request, {
				data: emails.data,
				pagination: {
					count: emails.count,
					page: request.query.page,
					perPage: request.query.perPage,
				},
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("email"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
};

export default {
	controller: getMultipleController,
	zodSchema: emailsSchema.getMultiple,
	swaggerSchema: {
		description: "Returns multiple emails based on the query parameters.",
		tags: ["emails"],
		summary: "Get multiple emails",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: EmailsFormatter.swagger,
				},
				paginated: true,
			}),
		},
		querystring: swaggerQueryString({
			filters: [
				{
					key: "toAddress",
				},
				{
					key: "subject",
				},
				{
					key: "deliveryStatus",
					enum: ["sent", "failed", "pending"],
				},
				{
					key: "type",
					enum: ["internal", "external"],
				},
				{
					key: "template",
				},
			],
			sorts: ["sentCount", "createdAt", "updatedAt"],
			page: true,
			perPage: true,
		}),
	},
};
