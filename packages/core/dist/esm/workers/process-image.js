import sharp from "sharp";
import { parentPort, Worker } from "worker_threads";
import path from "path";
import mime from "mime-types";
parentPort?.on("message", async (data) => {
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
        const response = {
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
    }
    catch (error) {
        const response = {
            success: false,
            error: error.message,
        };
        parentPort?.postMessage(response);
    }
});
const useProcessImage = async (data) => {
    const worker = new Worker(path.join(__dirname, "process-image.ts"));
    return new Promise((resolve, reject) => {
        worker.on("message", (message) => {
            if (message.success) {
                resolve(message.data);
            }
            else {
                reject(new Error(message.error));
            }
        });
        worker.postMessage(data);
    });
};
export default useProcessImage;
//# sourceMappingURL=process-image.js.map