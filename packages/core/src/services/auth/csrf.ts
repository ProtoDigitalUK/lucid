import { FastifyRequest, FastifyReply } from "fastify";
import crypto from "crypto";
// Services
import Config from "@services/Config.js";

export const generateCSRFToken = (reply: FastifyReply) => {
  const token = crypto.randomBytes(32).toString("hex");

  reply.setCookie("_csrf", token, {
    maxAge: 86400000 * 7,
    httpOnly: true,
    secure: Config.mode === "production",
    sameSite: "strict",
    path: "/",
  });

  return token;
};

export const verifyCSRFToken = (request: FastifyRequest) => {
  const cookieCSRF = request.cookies["_csrf"];
  const headerCSRF = request.headers["_csrf"] as string;

  if (!cookieCSRF || !headerCSRF) return false;
  if (cookieCSRF !== headerCSRF) return false;

  return true;
};

export const clearCSRFToken = (reply: FastifyReply) => {
  reply.clearCookie("_csrf", { path: "/" });
};

export default {
  generateCSRFToken,
  verifyCSRFToken,
  clearCSRFToken,
};
