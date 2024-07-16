import T from "../../translations/index.js";
import mime from "mime-types";
import sharp from "sharp";
import { getMediaType, generateKey } from "./index.js";
import { encode } from "blurhash";
import type { RouteMediaMetaData } from "../../types/types.js";
import type { ServiceResponse } from "../../utils/services/types.js";
import { b } from "vitest/dist/suite-BRl_IYuM.js";

const getFileMetaData = async (data: {
	filePath: string;
	mimeType: string;
	fileName: string;
}): ServiceResponse<RouteMediaMetaData> => {
	try {
		const mimeType = data.mimeType;
		const mediaType = getMediaType(mimeType);
		const transform = sharp(data.filePath);
		const fileExtension = mime.extension(data.mimeType);
		const [meta, buffer] = await Promise.all([
			transform.metadata(),
			transform.raw().toBuffer(),
		]);
		const width = meta.width ?? null;
		const height = meta.height ?? null;
		const size = meta.size || buffer.byteLength || 0;

		const blurHash =
			mediaType === "image" && buffer
				? encode(
						new Uint8ClampedArray(buffer),
						width || 0,
						height || 0,
						4,
						4,
					)
				: null;

		const mediaKey = generateKey(data.fileName, fileExtension);
		if (mediaKey.error) return mediaKey;

		return {
			error: undefined,
			data: {
				mimeType: mimeType,
				fileExtension: fileExtension || "",
				size: size,
				width: width,
				height: height,
				type: mediaType,
				key: mediaKey.data,
				blurHash: blurHash,
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
