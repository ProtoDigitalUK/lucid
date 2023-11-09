import { FastifyRequest } from "fastify";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Serivces
import languagesService from "@services/languages/index.js";

// ------------------------------------
// Content language
const contentLanguage = async (request: FastifyRequest) => {
  const contentLang = request.headers["lucid-content-lang"];

  const language = await service(
    languagesService.getSingleFallback,
    false
  )({
    id: contentLang !== null ? Number(contentLang) : undefined,
  });

  if (!language) {
    throw new LucidError({
      type: "basic",
      name: "Language Error",
      message: "Language not found",
      status: 404,
    });
  }

  request.language = language;
};

export default contentLanguage;
