import slug from "slug";
import { MultipartFile } from "@fastify/multipart";
import { BusboyFileStream } from "@fastify/busboy";
import mime from "mime-types";
import sharp from "sharp";
import z from "zod";
import { Readable } from "stream";
// Schema
import mediaSchema from "@schemas/media.js";
// Types
import { MediaResT } from "@lucid/types/src/media.js";

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

// Get file size
const getFileSize = (file: BusboyFileStream) => {
  return new Promise<number>((resolve, reject) => {
    let size = 0;
    file.on("data", (chunk) => {
      size += chunk.length;
    });
    file.on("end", () => {
      resolve(size);
    });
    file.on("error", reject);
  });
};

// Get meta data from a file
const getMetaData = async (
  fileStream: BusboyFileStream,
  data: {
    size: number;
    mimetype: string;
  }
): Promise<MediaMetaDataT> => {
  const fileExtension = mime.extension(data.mimetype);
  const mimeType = data.mimetype;
  const size = data.size;
  let width = null;
  let height = null;

  try {
    const transform = sharp();
    fileStream.pipe(transform);
    const metaData = await transform.metadata();
    width = metaData.width;
    height = metaData.height;
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

// -------------------------------------------
const helpers = {
  uniqueKey,
  getMetaData,
  formatReqFiles,
  createProcessKey,
  streamToBuffer,
  getMediaType,
  getFileSize,
};

export default helpers;
