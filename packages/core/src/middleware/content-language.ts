import { FastifyRequest } from "fastify";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Serivces
import languagesService from "@services/languages/index.js";

// ------------------------------------
// Content language
const contentLanguage = async (request: FastifyRequest) => {
  const contentLang = request.headers["headless-content-lang"];

  const language = await service(
    languagesService.getSingleFallback,
    false
  )({
    id: contentLang !== null ? Number(contentLang) : undefined,
  });

  if (!language) {
    throw new HeadlessError({
      type: "basic",
      name: "Language Error",
      message: "Language not found",
      status: 404,
    });
  }

  request.language = language;
};

export default contentLanguage;
