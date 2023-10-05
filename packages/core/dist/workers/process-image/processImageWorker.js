// src/workers/process-image/processImageWorker.ts
import sharp from "sharp";
import { parentPort } from "worker_threads";
import mime from "mime-types";
parentPort?.on("message", async (data) => {
  try {
    const transform = sharp(data.buffer);
    if (data.options.format) {
      transform.toFormat(data.options.format, {
        quality: data.options.quality ? parseInt(data.options.quality) : 80
      });
    }
    if (data.options.width || data.options.height) {
      transform.resize({
        width: data.options.width ? parseInt(data.options.width) : void 0,
        height: data.options.height ? parseInt(data.options.height) : void 0
      });
    }
    const outputBuffer = await transform.toBuffer();
    const meta = await sharp(outputBuffer).metadata();
    const mimeType = mime.lookup(data.options.format || "jpg") || "image/jpeg";
    const response = {
      success: true,
      data: {
        buffer: outputBuffer,
        mimeType,
        size: outputBuffer.length,
        width: meta.width || null,
        height: meta.height || null,
        extension: mime.extension(mimeType) || ""
      }
    };
    parentPort?.postMessage(response);
  } catch (error) {
    const response = {
      success: false,
      error: error.message
    };
    parentPort?.postMessage(response);
  }
});
//# sourceMappingURL=processImageWorker.js.map