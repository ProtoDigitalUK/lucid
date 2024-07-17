import T from "../../translations/index.js";
import { LucidAPIError } from "../../utils/errors/index.js";
import mime from "mime-types";
import sharp from "sharp";
import fs from "fs-extra";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { encode } from "blurhash";
import constants from "../../constants/constants.js";
import { getAverageColor } from "fast-average-color-node";
import { generateKey } from "../../utils/media/index.js";
import type { Config, MediaType } from "../../types.js";
import type { MultipartFile } from "@fastify/multipart";

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

	public async injectFile(file: MultipartFile) {
		this.mimeType = file.mimetype;
		this.name = file.filename;
		this.type = this.getMediaType(this.mimeType);
		this.extension = mime.extension(this.mimeType) || null;
		this.tempPath = await this.saveStreamToTempFile(file);

		const mediaKey = generateKey(this.name, this.extension);
		if (mediaKey.error) return mediaKey;
		this.key = mediaKey.data;

		await this.typeSpecificMeta(this.tempPath);
	}
	public async done() {
		if (!this.tempPath) return;
		await fs.remove(this.tempPath);
		this.tempPath = null;
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

	// ----------------------------------------
	// Getters
	get meta() {
		return {
			tempPath: this.tempPath,
			mimeType: this.mimeType,
			name: this.name,
			type: this.type,
			extension: this.extension,
			size: this.size,
			key: this.key,
			// image meta
			width: this.width,
			height: this.height,
			blurHash: this.blurHash,
			averageColour: this.averageColour,
			isDark: this.isDark,
			isLight: this.isLight,
		};
	}

	// ----------------------------------------
	// Private
	private async saveStreamToTempFile(file: MultipartFile) {
		const tempFilePath = join(constants.tempDir, file.filename);
		await fs.ensureDir(constants.tempDir);
		await pipeline(file.file, fs.createWriteStream(tempFilePath));
		this.size = fs.statSync(tempFilePath).size;
		return tempFilePath;
	}
	private streamTempFile(filePath: string) {
		return fs.createReadStream(filePath);
	}
	private async typeSpecificMeta(tempPath: string) {
		const file = this.streamTempFile(tempPath);

		switch (this.type) {
			case "image": {
				const transform = sharp();
				file.pipe(transform);
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
	}
}

export default MediaKit;
