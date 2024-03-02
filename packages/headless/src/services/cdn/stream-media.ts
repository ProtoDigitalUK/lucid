import { z } from "zod";
import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import getConfig from "../config.js";
import cdnSchema from "../../schemas/cdn.js";
import s3Services from "../s3/index.js";
import mediaHelpers from "../../utils/media/helpers.js";

export interface ServiceData {
	key: string;
	query: z.infer<typeof cdnSchema.streamSingle.query>;
	accept: string | undefined;
}

const streamMedia = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const format = mediaHelpers.chooseFormat(data.accept, data.query.format);
	console.log("format", format, data.query);

	// Stream original media
	if (
		format === undefined &&
		data.query?.width === undefined &&
		data.query?.height === undefined
	) {
		return await s3Services.getObject({
			key: data.key,
		});
	}
};

export default streamMedia;
