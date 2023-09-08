import type {
  WorkerData,
  ProcessImageSuccessRes,
  ProcessImageErrorRes,
} from "./processImageWorker.js";
import { Worker } from "worker_threads";
import path from "path";
// Utils
import getDirName from "@utils/app/get-dirname.js";

const currentDir = getDirName(import.meta.url);

const useProcessImage = async (
  data: WorkerData
): Promise<ProcessImageSuccessRes["data"]> => {
  const worker = new Worker(
    path.join(currentDir, "workers/process-image/processImageWorker.cjs")
  );

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
