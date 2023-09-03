import { Request, Response, NextFunction } from "express";
import expressFileUpload from "express-fileupload";
// Services
import Config from "@services/Config";

const fileUpload = async (req: Request, res: Response, next: NextFunction) => {
  // ------------------------------------
  // Set file upload options
  const options = {
    debug: Config.mode === "development",
  };

  // ------------------------------------
  // Set file upload middleware
  expressFileUpload(options)(req, res, next);
};

export default fileUpload;
