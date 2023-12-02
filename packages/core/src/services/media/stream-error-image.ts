import fs from "fs-extra";
import path from "path";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
import { decodeError } from "@utils/app/error-handler.js";
import getDirName from "@utils/app/get-dirname.js";
// Services
import Config from "@services/Config.js";
import mediaService from "@services/media/index.js";

const currentDir = getDirName(import.meta.url);

export interface ServiceData {
  fallback?: "1" | "0";
  error: Error;
}

const pipeLocalImage = () => {
  let pathVal = path.join(currentDir, "./assets/404.jpg");
  let contentType = "image/jpeg";

  const steam = fs.createReadStream(pathVal);

  return {
    body: steam,
    contentType: contentType,
  };
};

const streamErrorImage = async (data: ServiceData) => {
  const error = decodeError(data.error);

  if (error.status !== 404) {
    throw error;
  }

  if (Config.media.fallbackImage === false || data.fallback === "0") {
    throw new HeadlessError({
      type: "basic",
      name: "Error",
      message: "We're sorry, but this image is not available.",
      status: 404,
    });
  }

  if (Config.media.fallbackImage === undefined) {
    return pipeLocalImage();
  }

  try {
    const { buffer, contentType } = await mediaService.pipeRemoteURL({
      url: Config.media.fallbackImage as string,
    });

    return {
      body: buffer,
      contentType: contentType || "image/jpeg",
    };
  } catch (err) {
    return pipeLocalImage();
  }
};

export default streamErrorImage;
