import fs from "fs-extra";
import https from "https";
import path from "path";
import { Response } from "express";
// Utils
import { LucidError } from "@utils/app/error-handler";
// Services
import Config from "@services/Config";
import mediaService from "@services/media";

export interface ServiceData {
  fallback?: "1" | "0";
  res: Response;
}

const pipeLocalImage = (res: Response) => {
  let pathVal = path.join(__dirname, "../../assets/404.jpg");
  let contentType = "image/jpeg";

  const steam = fs.createReadStream(pathVal);
  res.setHeader("Content-Type", contentType);
  steam.pipe(res);
};

const streamErrorImage = async (data: ServiceData) => {
  if (Config.media.fallbackImage === false || data.fallback === "0") {
    throw new LucidError({
      type: "basic",
      name: "Error",
      message: "We're sorry, but this image is not available.",
      status: 404,
    });
  }

  if (Config.media.fallbackImage === undefined) {
    pipeLocalImage(data.res);
    return;
  }

  try {
    mediaService.pipeRemoteURL({
      url: Config.media.fallbackImage,
      res: data.res,
    });
  } catch (err) {
    pipeLocalImage(data.res);
    return;
  }
};

export default streamErrorImage;
