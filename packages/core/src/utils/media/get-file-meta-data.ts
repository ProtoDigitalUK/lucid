import T from "../../translations/index.js";
import mime from "mime-types";
import sharp from "sharp";
import { getMediaType, generateKey, streamTempFile } from "./index.js";
import { encode } from "blurhash";
import type { RouteMediaMetaData } from "../../types/types.js";
import type { ServiceResponse } from "../../utils/services/types.js";

const getFileMetaData = async (data: {
	filePath: string;
	mimeType: string;
	fileName: string;
}): ServiceResponse<RouteMediaMetaData> => {
	try {
		const file = streamTempFile(data.filePath);

		let width = null;
		let height = null;
		let blurHash = null;

		const transform = sharp();
		file.pipe(transform);
		const meta = await transform.metadata();

		const mediaType = getMediaType(data.mimeType);
		const fileExtension = mime.extension(data.mimeType) || null;
		const size = meta.size || 0;

		if (mediaType === "image") {
			const buffer = await transform
				.raw()
				.resize({
					width: 100,
				})
				.ensureAlpha()
				.toBuffer({ resolveWithObject: true });
			width = meta.width || null;
			height = meta.height || null;

			blurHash = encode(
				new Uint8ClampedArray(buffer.data),
				buffer.info.width,
				buffer.info.height,
				4,
				4,
			);
		}

		const mediaKey = generateKey(data.fileName, fileExtension);
		if (mediaKey.error) return mediaKey;

		return {
			error: undefined,
			data: {
				mimeType: data.mimeType,
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
