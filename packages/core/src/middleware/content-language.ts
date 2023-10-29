import { Request, Response, NextFunction } from "express";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Serivces
import languagesService from "@services/languages/index.js";

// ------------------------------------
// Content language
const contentLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contentLang = req.headers["lucid-content-lang"];

    const language = await service(
      languagesService.getSingleFallback,
      false
    )({
      code: contentLang as string | undefined,
    });

    if (!language) {
      throw new LucidError({
        type: "basic",
        name: "Language Error",
        message: "Language not found",
        status: 404,
      });
    }

    req.language = language;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default contentLanguage;
