import fs from "fs-extra";
import path from "path";
import { NextFunction, Response } from "express";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
import { decodeError } from "@utils/app/error-handler.js";
import getDirName from "@utils/app/get-dirname.js";
// Services
import Config from "@services/Config.js";
import mediaService from "@services/media/index.js";

const currentDir = getDirName(import.meta.url);

export interface ServiceData {
  fallback?: "1" | "0";
  error: Error;
  res: Response;
  next: NextFunction;
}

const pipeLocalImage = (res: Response) => {
  let pathVal = path.join(currentDir, "../../assets/404.jpg");
  let contentType = "image/jpeg";

  const steam = fs.createReadStream(pathVal);
  res.setHeader("Content-Type", contentType);
  steam.pipe(res);
};

const streamErrorImage = async (data: ServiceData) => {
  const error = decodeError(data.error);

  if (error.status !== 404) {
    data.next(data.error);
    return;
  }

  if (Config.media.fallbackImage === false || data.fallback === "0") {
    data.next(
      new LucidError({
        type: "basic",
        name: "Error",
        message: "We're sorry, but this image is not available.",
        status: 404,
      })
    );
    return;
  }

  if (Config.media.fallbackImage === undefined) {
    pipeLocalImage(data.res);
    return;
  }

  try {
    const { buffer, contentType } = await mediaService.pipeRemoteURL({
      url: Config.media.fallbackImage as string,
    });
    data.res.setHeader("Content-Type", contentType || "image/jpeg");
    data.res.send(buffer);
  } catch (err) {
    pipeLocalImage(data.res);
    return;
  }
};

export default streamErrorImage;
