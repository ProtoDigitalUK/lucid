import crypto from "node:crypto";
import T from "../../translations/index.js";
import { PRESIGNED_URL_EXPIRY } from "../../constants.js";
import type { PluginOptions } from "../../types/types.js";
import type { ServiceFn } from "@lucidcms/core/types";

const validatePresignedToken: ServiceFn<
	[
		{
			pluginOptions: PluginOptions;
			key: string;
			token: string;
			timestamp: string;
		},
	],
	undefined
> = async (_, data) => {
	const expectedToken = crypto
		.createHmac("sha256", data.pluginOptions.secretKey)
		.update(`${data.key}${data.timestamp}`)
		.digest("hex");

	if (
		data.token !== expectedToken ||
		Date.now() - Number.parseInt(data.timestamp) > PRESIGNED_URL_EXPIRY
	) {
		return {
			error: {
				status: 403,
				type: "basic",
				message: T("invalid_or_expired_token"),
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: undefined,
	};
};

export default validatePresignedToken;
