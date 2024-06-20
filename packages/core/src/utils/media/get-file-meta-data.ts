import T from "../../translations/index.js";
import mime from "mime-types";
import sharp from "sharp";
import { streamTempFile, getMediaType, generateKey } from "./index.js";
import type { RouteMediaMetaData } from "../../types/types.js";
import type { ServiceResponse } from "../../utils/services/types.js";

const getFileMetaData = async (data: {
	filePath: string;
	mimeType: string;
	fileName: string;
}): ServiceResponse<RouteMediaMetaData> => {
	try {
		const file = streamTempFile(data.filePath);

		const fileExtension = mime.extension(data.mimeType);
		const mimeType = data.mimeType;
		let size = 0;
		let width = null;
		let height = null;

		const transform = sharp();
		file.pipe(transform);
		const metaData = await transform.metadata();
		width = metaData.width;
		height = metaData.height;
		size = metaData.size || 0;

		const mediaKey = generateKey(data.fileName, fileExtension);
		if (mediaKey.error) return mediaKey;

		return {
			error: undefined,
			data: {
				mimeType: mimeType,
				fileExtension: fileExtension || "",
				size: size,
				width: width || null,
				height: height || null,
				type: getMediaType(mimeType),
				key: mediaKey.data,
			},
		};
	} catch (error) {
		return {
			error: {
				type: "basic",
				message:
					// @ts-expect-error
					error?.message || T("media_error_getting_metadata"),
			},
			data: undefined,
		};
	}
};

export default getFileMetaData;
