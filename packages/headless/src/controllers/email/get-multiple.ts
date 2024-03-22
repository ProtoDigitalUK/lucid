import emailsSchema from "../../schemas/email.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import emailServices from "../../services/email/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerEmailsRes } from "../../format/format-emails.js";

const getMultipleController: ControllerT<
	typeof emailsSchema.getMultiple.params,
	typeof emailsSchema.getMultiple.body,
	typeof emailsSchema.getMultiple.query
> = async (request, reply) => {
	const emails = await serviceWrapper(emailServices.getMultiple, false)(
		{
			db: request.server.db,
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
				perPage: request.query.per_page,
			},
		}),
	);
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
					items: swaggerEmailsRes,
				},
				paginated: true,
			}),
		},
		querystring: swaggerQueryString({
			filters: [
				{
					key: "to_address",
				},
				{
					key: "subject",
				},
				{
					key: "delivery_status",
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
			sorts: ["sent_count", "created_at", "updated_at"],
			page: true,
			perPage: true,
		}),
	},
};
