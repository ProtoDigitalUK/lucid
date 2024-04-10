import fs from "fs-extra";
import type { Readable } from "node:stream";
import type { MediaResT, MediaTypeT } from "../types/response.js";
import { pipeline } from "node:stream/promises";
import { join } from "node:path";
import mime from "mime-types";
import sharp from "sharp";
import slug from "slug";
import { getMonth, getYear } from "date-fns";

export interface MediaMetaDataT {
	mimeType: string;
	fileExtension: string;
	size: number;
	width: number | null;
	height: number | null;
	type: MediaResT["type"];
	key: string;
	etag?: string;
}

// Get meta data from file
const getMetaData = async (data: {
	filePath: string;
	mimeType: string;
	fileName: string;
}): Promise<MediaMetaDataT> => {
	const file = streamTempFile(data.filePath);

	const fileExtension = mime.extension(data.mimeType);
	const mimeType = data.mimeType;
	let size = 0;
	let width = null;
	let height = null;

	try {
		const transform = sharp();
		file.pipe(transform);
		const metaData = await transform.metadata();
		width = metaData.width;
		height = metaData.height;
		size = metaData.size || 0;
	} catch (error) {}

	return {
		mimeType: mimeType,
		fileExtension: fileExtension || "",
		size: size,
		width: width || null,
		height: height || null,
		type: getMediaType(mimeType),
		key: generateKey(data.fileName),
	};
};

// Workout media type
const getMediaType = (mimeType: string): MediaTypeT => {
	const normalizedMimeType = mimeType.toLowerCase();

	if (normalizedMimeType.includes("image")) return "image";
	if (normalizedMimeType.includes("video")) return "video";
	if (normalizedMimeType.includes("audio")) return "audio";
	if (
		normalizedMimeType.includes("pdf") ||
		normalizedMimeType.startsWith("application/vnd")
	)
		return "document";
	if (
		normalizedMimeType.includes("zip") ||
		normalizedMimeType.includes("tar")
	)
		return "archive";

	return "unknown";
};

// Generate unique key
const generateKey = (name: string) => {
	const [fname, extension] = name.split(".");
	let filename = slug(fname, {
		lower: true,
	});
	if (filename.length > 254) filename = filename.slice(0, 254);
	const uuid = Math.random().toString(36).slice(-6);
	const date = new Date();
	const month = getMonth(date);
	const monthF = month + 1 >= 10 ? `${month + 1}` : `0${month + 1}`;

	return `${getYear(date)}/${monthF}/${uuid}-${filename}.${extension}`;
};

// Save stream to a temporary file
const saveStreamToTempFile = async (stream: Readable, name: string) => {
	const tempDir = "./tmp";
	await fs.ensureDir(tempDir);

	const tempFilePath = join(tempDir, name);

	await pipeline(stream, fs.createWriteStream(tempFilePath));

	return tempFilePath;
};

// Stream temp file
const streamTempFile = (filePath: string): Readable => {
	return fs.createReadStream(filePath);
};

// Remove temp file
const deleteTempFile = async (filePath?: string) => {
	if (!filePath) return;
	await fs.remove(filePath);
};

// Choose format based on accept header and query
const chooseFormat = (
	accept: string | undefined,
	queryFormat?: "avif" | "webp" | "jpeg" | "png" | undefined,
) => {
	if (queryFormat) return queryFormat;

	if (accept) {
		if (accept.includes("image/avif")) return "avif";
		if (accept.includes("image/webp")) return "webp";
	}

	return undefined;
};

// Create process key
const generateProcessKey = (data: {
	key: string;
	options: {
		format?: string;
		quality?: string;
		width?: string;
		height?: string;
	};
}) => {
	const [targetK, ext] = data.key.split(".");
	let key = `processed/${targetK}`;

	if (data.options.quality) key = key.concat(`-${data.options.quality}`);
	if (data.options.width) key = key.concat(`-${data.options.width}`);
	if (data.options.height) key = key.concat(`-${data.options.height}`);

	if (data.options.format) key = key.concat(`.${data.options.format}`);
	else key = key.concat(`.${ext}`);

	return key;
};

// Steam to buffer
const streamToBuffer = (readable: Readable): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		readable.on("data", (chunk) => chunks.push(chunk));
		readable.on("end", () => resolve(Buffer.concat(chunks)));
		readable.on("error", reject);
	});
};

// CDN URL
const createURL = (host: string, key: string) => `${host}/cdn/v1/${key}`;

const mediaHelpers = {
	getMediaType,
	generateKey,
	streamTempFile,
	saveStreamToTempFile,
	getMetaData,
	deleteTempFile,
	chooseFormat,
	generateProcessKey,
	streamToBuffer,
	createURL,
};

export default mediaHelpers;
