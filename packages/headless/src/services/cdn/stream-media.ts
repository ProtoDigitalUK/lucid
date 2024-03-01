import { z } from "zod";
import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import getConfig from "../config.js";
import cdnSchema from "../../schemas/cdn.js";
import s3Services from "../s3/index.js";

export interface ServiceData {
	key: string;
	query: z.infer<typeof cdnSchema.streamSingle.query>;
}

const streamMedia = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	// Stream image from S3/R2
	if (
		data.query?.format === undefined &&
		data.query?.width === undefined &&
		data.query?.height === undefined
	) {
		return await s3Services.getObject({
			key: data.key,
		});
	}
};

export default streamMedia;
