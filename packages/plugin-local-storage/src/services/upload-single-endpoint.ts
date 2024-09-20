import T from "../translations/index.js";
import fs from "fs-extra";
import checks from "./checks/index.js";
import { keyPaths } from "../utils/helpers.js";
import type { ServiceFn } from "@lucidcms/core/types";
import type { PluginOptions } from "../types/types.js";

const uploadSingle: ServiceFn<
	[
		{
			buffer: Buffer | undefined | null;
			key: string;
			token: string;
			timestamp: string;
			pluginOptions: PluginOptions;
		},
	],
	boolean
> = async (context, data) => {
	const checkPresignedTokenRes = await checks.validatePresignedToken(
		context,
		{
			pluginOptions: data.pluginOptions,
			key: data.key,
			token: data.token,
			timestamp: data.timestamp,
		},
	);
	if (checkPresignedTokenRes.error) return checkPresignedTokenRes;

	const { targetDir, targetPath } = keyPaths(
		data.key,
		data.pluginOptions.uploadDir,
	);

	await fs.ensureDir(targetDir);

	if (Buffer.isBuffer(data.buffer)) {
		await fs.writeFile(targetPath, data.buffer as unknown as Uint8Array);
	} else {
		return {
			error: {
				type: "basic",
				status: 400,
				message: T("invalid_file"),
			},
		};
	}

	return {
		error: undefined,
		data: true,
	};
};

export default uploadSingle;
