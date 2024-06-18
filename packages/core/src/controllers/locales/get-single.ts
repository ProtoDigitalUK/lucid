import T from "../../translations/index.js";
import localeSchema from "../../schemas/locales.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import lucidServices from "../../services/index.js";
import buildResponse from "../../utils/build-response.js";
import LocalesFormatter from "../../libs/formatters/locales.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const getSingleController: RouteController<
	typeof localeSchema.getSingle.params,
	typeof localeSchema.getSingle.body,
	typeof localeSchema.getSingle.query
> = async (request, reply) => {
	const localeRes = await serviceWrapper(lucidServices.locale.getSingle, {
		transaction: false,
		defaultError: {
			type: "basic",
			name: T("route_locale_fetch_error_name"),
			message: T("route_locale_fetch_error_message"),
			status: 500,
		},
	})(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			code: request.params.code,
		},
	);
	if (localeRes.error) throw new LucidAPIError(localeRes.error);

	reply.status(200).send(
		await buildResponse(request, {
			data: localeRes.data,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: localeSchema.getSingle,
	swaggerSchema: {
		description: "Returns a single locale based on the code URL parameter.",
		tags: ["locales"],
		summary: "Get a single locale",
		response: {
			200: swaggerResponse({
				type: 200,
				data: LocalesFormatter.swagger,
			}),
		},
	},
};
