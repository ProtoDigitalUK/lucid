import T from "../../translations/index.js";
import mime from "mime-types";
import sharp from "sharp";
import slug from "slug";
import fs from "fs-extra";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { encode } from "blurhash";
import constants from "../../constants/constants.js";
import { getAverageColor } from "fast-average-color-node";
import { getMonth, getYear } from "date-fns";
import type { Config, MediaType } from "../../exports/types.js";
import type { ServiceResponse } from "../../utils/services/types.js";
import type { MultipartFile } from "@fastify/multipart";
import type { BooleanInt } from "../db/types.js";

export interface MediaKitMeta {
	tempPath: string | null;
	mimeType: string;
	name: string;
	type: MediaType;
	extension: string;
	size: number;
	key: string;
	etag: string | null;
	// image meta
	width: number | null;
	height: number | null;
	blurHash: string | null;
	averageColour: string | null;
	isDark: BooleanInt | null;
	isLight: BooleanInt | null;
}

class MediaKit {
	config: Config["media"];

	tempPath: string | null = null;
	name: string | null = null;
	type: MediaType = "unknown";
	mimeType: string | null = null;
	extension: string | null = null;
	size: number | null = null;
	key: string | null = null;
	// image meta
	blurHash: string | null = null;
	width: number | null = null;
	height: number | null = null;
	averageColour: string | null = null;
	isDark: boolean | null = null;
	isLight: boolean | null = null;

	constructor(config: Config["media"]) {
		this.config = config;
	}

	public async injectFile(
		file: MultipartFile,
	): ServiceResponse<MediaKitMeta> {
		this.mimeType = file.mimetype;
		this.name = file.filename;
		this.type = this.getMediaType(this.mimeType);
		this.extension =
			mime.extension(this.mimeType) ||
			file.filename.split(".").pop() ||
			"";

		const mediaKey = MediaKit.generateKey({
			name: this.name,
			extension: this.extension,
		});
		if (mediaKey.error) return mediaKey;
		this.key = mediaKey.data;

		const saveTempRes = await this.saveStreamToTempFile(file);
		if (saveTempRes.error) return saveTempRes;
		this.tempPath = saveTempRes.data.path;
		this.size = saveTempRes.data.size;

		const metaRes = await this.typeSpecificMeta(this.tempPath);
		if (metaRes.error) return metaRes;

		return {
			error: undefined,
			data: {
				tempPath: this.tempPath,
				mimeType: this.mimeType,
				name: this.name,
				type: this.type,
				extension: this.extension,
				size: this.size,
				key: this.key,
				etag: null,
				width: this.width,
				height: this.height,
				blurHash: this.blurHash,
				averageColour: this.averageColour,
				isDark: this.isDark === null ? null : this.isDark ? 1 : 0,
				isLight: this.isLight === null ? null : this.isLight ? 1 : 0,
			},
		};
	}
	public async done(): ServiceResponse<undefined> {
		if (!this.tempPath) {
			return {
				error: undefined,
				data: undefined,
			};
		}

		await fs.remove(this.tempPath);
		this.tempPath = null;

		return {
			error: undefined,
			data: undefined,
		};
	}

	// ----------------------------------------
	// Helpers
	public getMediaType(mimeType?: string | null): MediaType {
		const mt = mimeType?.toLowerCase();
		if (!mt) return "unknown";
		if (mt.includes("image")) return "image";
		if (mt.includes("video")) return "video";
		if (mt.includes("audio")) return "audio";
		if (mt.includes("pdf") || mt.startsWith("application/vnd"))
			return "document";
		if (mt.includes("zip") || mt.includes("tar")) return "archive";
		return "unknown";
	}
	public static generateKey(props: {
		name: string;
		extension: string | null;
	}): Awaited<ServiceResponse<string>> {
		const [name, extension] = props.name.split(".");
		const ext = props.extension || extension;

		if (!name || !ext) {
			return {
				error: {
					type: "basic",
					name: T("media_name_invalid"),
					message: T("media_name_invalid"),
					status: 400,
				},
				data: undefined,
			};
		}

		let filename = slug(name, {
			lower: true,
		});
		if (filename.length > 254) filename = filename.slice(0, 254);
		const uuid = Math.random().toString(36).slice(-6);
		const date = new Date();
		const month = getMonth(date);
		const monthF = month + 1 >= 10 ? `${month + 1}` : `0${month + 1}`;

		return {
			error: undefined,
			data: `${getYear(date)}/${monthF}/${uuid}-${filename}.${ext}`,
		};
	}
	public streamTempFile() {
		if (!this.tempPath) return undefined;
		return fs.createReadStream(this.tempPath);
	}

	// ----------------------------------------
	// Private
	private async saveStreamToTempFile(file: MultipartFile): ServiceResponse<{
		path: string;
		size: number;
	}> {
		try {
			const tempFilePath = join(constants.tempDir, file.filename);
			await fs.ensureDir(constants.tempDir);
			await pipeline(file.file, fs.createWriteStream(tempFilePath));
			return {
				error: undefined,
				data: {
					path: tempFilePath,
					size: fs.statSync(tempFilePath).size,
				},
			};
		} catch (error) {
			return {
				error: {
					type: "basic",
					name: T("media_error_getting_metadata"),
					message:
						// @ts-expect-error
						error?.message || T("media_error_getting_metadata"),
					status: 500,
				},
				data: undefined,
			};
		}
	}
	private async typeSpecificMeta(
		tempPath: string,
	): ServiceResponse<undefined> {
		try {
			const file = this.streamTempFile();

			switch (this.type) {
				case "image": {
					const transform = sharp();
					file?.pipe(transform);
					const meta = await transform.metadata();

					this.width = meta.width || null;
					this.height = meta.height || null;

					const [hashBuffer, acBuffer] = await Promise.all([
						transform
							.raw()
							.resize({
								width: 100,
							})
							.ensureAlpha()
							.toBuffer({ resolveWithObject: true }),
						transform
							.webp({ quality: 80 })
							.resize({
								width: 100,
							})
							.toBuffer({ resolveWithObject: true }),
					]);

					this.blurHash = encode(
						new Uint8ClampedArray(hashBuffer.data),
						hashBuffer.info.width,
						hashBuffer.info.height,
						4,
						4,
					);

					const averageRes = await getAverageColor(acBuffer.data);
					this.averageColour = averageRes.rgba;
					this.isDark = averageRes.isDark;
					this.isLight = averageRes.isLight;
				}
			}

			return {
				error: undefined,
				data: undefined,
			};
		} catch (error) {
			return {
				error: {
					type: "basic",
					name: T("media_error_getting_metadata"),
					message:
						// @ts-expect-error
						error?.message || T("media_error_getting_metadata"),
					status: 500,
				},
				data: undefined,
			};
		}
	}
}

export default MediaKit;
