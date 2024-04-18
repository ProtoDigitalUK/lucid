import type z from "zod";
import type cdnSchema from "../../schemas/cdn.js";
import sharp from "sharp";
import mime from "mime-types";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	buffer: Buffer;
	options: z.infer<typeof cdnSchema.streamSingle.query>;
}

export interface ProcessImageSuccessRes {
	success: boolean;
	error?: string;
	data?: {
		buffer: Buffer;
		mimeType: string;
		size: number;
		width: number | null;
		height: number | null;
		extension: string;
	};
}

const optimiseImage = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
): Promise<ProcessImageSuccessRes> => {
	try {
		const transform = sharp(data.buffer);

		if (data.options.format) {
			transform.toFormat(data.options.format, {
				quality: data.options.quality
					? Number.parseInt(data.options.quality)
					: 80,
			});
		}

		if (data.options.width || data.options.height) {
			transform.resize({
				width: data.options.width
					? Number.parseInt(data.options.width)
					: undefined,
				height: data.options.height
					? Number.parseInt(data.options.height)
					: undefined,
			});
		}

		const outputBuffer = await transform.toBuffer();
		const meta = await sharp(outputBuffer).metadata();

		const mimeType =
			mime.lookup(data.options.format || "jpg") || "image/jpeg";

		return {
			success: true,
			data: {
				buffer: outputBuffer,
				mimeType: mimeType,
				size: outputBuffer.length,
				width: meta.width || null,
				height: meta.height || null,
				extension: mime.extension(mimeType) || "",
			},
		};
	} catch (error) {
		return {
			success: false,
			error: (error as Error).message,
		};
	}
};

export default optimiseImage;
