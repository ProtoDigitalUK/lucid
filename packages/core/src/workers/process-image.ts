import z from "zod";
import sharp from "sharp";
import { parentPort, Worker } from "worker_threads";
import path from "path";
import mime from "mime-types";
// Utils
import getDirName from "@utils/app/get-dirname.js";
// Schema
import mediaSchema from "@schemas/media.js";

const currentDir = getDirName(import.meta.url);

interface WorkerData {
  buffer: Buffer;
  options: z.infer<typeof mediaSchema.streamSingle.query>;
}

export interface ProcessImageSuccessRes {
  success: true;
  data: {
    buffer: Buffer;
    mimeType: string;
    size: number;
    width: number | null;
    height: number | null;
    extension: string;
  };
}

interface ProcessImageErrorRes {
  success: false;
  error: string;
}

parentPort?.on("message", async (data: WorkerData) => {
  try {
    const transform = sharp(data.buffer);

    if (data.options.format) {
      transform.toFormat(data.options.format, {
        quality: data.options.quality ? parseInt(data.options.quality) : 80,
      });
    }

    if (data.options.width || data.options.height) {
      transform.resize({
        width: data.options.width ? parseInt(data.options.width) : undefined,
        height: data.options.height ? parseInt(data.options.height) : undefined,
      });
    }

    const outputBuffer = await transform.toBuffer();
    const meta = await sharp(outputBuffer).metadata();

    const mimeType = mime.lookup(data.options.format || "jpg") || "image/jpeg";

    const response: ProcessImageSuccessRes = {
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
    parentPort?.postMessage(response);
  } catch (error) {
    const response: ProcessImageErrorRes = {
      success: false,
      error: (error as Error).message,
    };
    parentPort?.postMessage(response);
  }
});

const useProcessImage = async (
  data: WorkerData
): Promise<ProcessImageSuccessRes["data"]> => {
  const worker = new Worker(path.join(currentDir, "process-image.ts"));

  return new Promise((resolve, reject) => {
    worker.on(
      "message",
      (message: ProcessImageSuccessRes | ProcessImageErrorRes) => {
        if (message.success) {
          resolve(message.data);
        } else {
          reject(new Error(message.error));
        }
      }
    );

    worker.postMessage(data);
  });
};

export default useProcessImage;
