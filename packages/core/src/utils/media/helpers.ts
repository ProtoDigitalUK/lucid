import slug from "slug";
import fs from "fs-extra";
import { MultipartFile } from "@fastify/multipart";
import mime from "mime-types";
import sharp from "sharp";
import z from "zod";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { join } from "path";
// Schema
import mediaSchema from "@schemas/media.js";
// Types
import { MediaResT } from "@headless/types/src/media.js";

// -------------------------------------------
// Types
export interface MediaMetaDataT {
  mimeType: string;
  fileExtension: string;
  size: number;
  width: number | null;
  height: number | null;
}

export interface CreateProcessKeyT {
  key: string;
  query: z.infer<typeof mediaSchema.streamSingle.query>;
}

// -------------------------------------------
// Functions

// Generate a unique key for a media item
const uniqueKey = (name: string) => {
  const slugVal = slug(name, {
    lower: true,
  });
  return `${slugVal}-${Date.now()}`;
};

// Get meta data from a file
const getMetaData = async (data: {
  filePath: string;

  mimetype: string;
}): Promise<MediaMetaDataT> => {
  const file = streamTempFile(data.filePath);

  const fileExtension = mime.extension(data.mimetype);
  const mimeType = data.mimetype;
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
  };
};

// formats files from request into an array
const formatReqFiles = (files: MultipartFile) => {
  const file = files["file"];
  if (Array.isArray(file)) {
    return file;
  } else {
    return [file];
  }
};

// Create process key
const createProcessKey = (data: CreateProcessKeyT) => {
  let key = `processed/${data.key}`;
  if (data.query.format) key = key.concat(`.${data.query.format}`);
  if (data.query.quality) key = key.concat(`.${data.query.quality}`);
  if (data.query.width) key = key.concat(`.${data.query.width}`);
  if (data.query.height) key = key.concat(`.${data.query.height}`);

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

// Workout media type
const getMediaType = (mimeType: string): MediaResT["type"] => {
  const normalizedMimeType = mimeType.toLowerCase();

  if (normalizedMimeType.includes("image")) return "image";
  if (normalizedMimeType.includes("video")) return "video";
  if (normalizedMimeType.includes("audio")) return "audio";
  if (
    normalizedMimeType.includes("pdf") ||
    normalizedMimeType.startsWith("application/vnd")
  )
    return "document";
  if (normalizedMimeType.includes("zip") || normalizedMimeType.includes("tar"))
    return "archive";

  return "unknown";
};

// save stream to temp file
const saveStreamToTempFile = async (stream: Readable, name: string) => {
  const tempDir = "./tmp";
  await fs.ensureDir(tempDir);

  const tempFilePath = join(tempDir, name);

  await pipeline(stream, fs.createWriteStream(tempFilePath));

  return tempFilePath;
};

const streamTempFile = (filePath: string): Readable => {
  return fs.createReadStream(filePath);
};

const deleteTempFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting temporary file: ${filePath}`, error);
  }
};

// -------------------------------------------
const helpers = {
  uniqueKey,
  getMetaData,
  formatReqFiles,
  createProcessKey,
  streamToBuffer,
  getMediaType,
  saveStreamToTempFile,
  streamTempFile,
  deleteTempFile,
};

export default helpers;
