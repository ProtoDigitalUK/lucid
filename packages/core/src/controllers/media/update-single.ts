import T from "../../translations/index.js";
import mediaSchema from "../../schemas/media.js";
import { swaggerResponse, swaggerHeaders } from "../../utils/swagger/index.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/errors/index.js";
import type { RouteController } from "../../types/types.js";

const updateSingleController: RouteController<
	typeof mediaSchema.updateSingle.params,
	typeof mediaSchema.updateSingle.body,
	typeof mediaSchema.updateSingle.query
> = async (request, reply) => {
	const updateMedia = await serviceWrapper(
		request.server.services.media.updateSingle,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: T("route_media_update_error_name"),
				message: T("route_media_update_error_message"),
			},
		},
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
			services: request.server.services,
		},
		{
			id: Number.parseInt(request.params.id),
			fileData: await request.file(),
			title: request.body.title,
			alt: request.body.alt,
		},
	);
	if (updateMedia.error) throw new LucidAPIError(updateMedia.error);

	reply.status(204).send();
};

export default {
	controller: updateSingleController,
	zodSchema: mediaSchema.updateSingle,
	swaggerSchema: {
		description:
			"Update a single media entry with translations and new upload.",
		tags: ["media"],
		summary: "Update a single media entry.",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		consumes: ["multipart/form-data"],
		body: {
			type: "object",
			properties: {
				file: {
					type: "string",
					format: "binary",
				},
			},
		},
		querystring: {
			type: "object",
			required: ["body"],
			properties: {
				body: {
					type: "string",
					description:
						'Stringified JSON data containing tileTranslations and alt for the media.<br><br>Example: <code>{"title":[{"localeCode":"en","value":"title value"}],"alt":[{"localeCode":"en","value":"alt value"}]}</code>.<br><br>Translations dont have to be passed.',
				},
			},
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
