import https from "https";
import { Response } from "express";

export interface ServiceData {
  url: string;
  res: Response;
  redirections?: number;
}

const pipeRemoteURL = (data: ServiceData) => {
  https
    .get(data.url, (response) => {
      const { statusCode } = response;
      const redirections = data?.redirections || 0;

      if (
        statusCode &&
        statusCode >= 300 &&
        statusCode < 400 &&
        response.headers.location &&
        redirections < 5
      ) {
        // Handle redirect, increase the redirection count, and try again
        pipeRemoteURL({
          url: response.headers.location,
          res: data.res,
          redirections: redirections + 1,
        });
        return;
      }

      if (statusCode !== 200) {
        throw new Error(`Request failed. Status code: ${statusCode}`);
      }

      const contentType = response.headers["content-type"];
      if (contentType) {
        data.res.setHeader("Content-Type", contentType);
      }

      response.on("error", (error) => {
        throw new Error("Error fetching the fallback image");
      });

      response.pipe(data.res);
    })
    .on("error", (error) => {
      throw new Error("Error with the HTTPS request");
    });
};

export default pipeRemoteURL;
