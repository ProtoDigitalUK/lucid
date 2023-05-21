import { Request } from "express";
import { LucidError } from "@utils/error-handler";
import Config from "@db/models/Config";

export const generateCSRFToken = (req: Request) => {
  // create a random string for CSRF token
  const token = crypto.getRandomValues(new Uint8Array(32)).join("");

  // store the CSRF token a httpOnly cookie,
  req.cookies.set("CSRF", token, {
    httpOnly: true,
    secure: Config.environment === "production",
    sameSite: "strict",
  });

  return token;
};

export const verifyCSRFToken = (req: Request) => {
  const { CSRF } = req.cookies;
  const { CSRF: CSRFHeader } = req.headers;

  if (!CSRF || !CSRFHeader) {
    throw new LucidError({
      type: "authorisation",
      message: "CSRF token missing",
    });
  }

  if (CSRF !== CSRFHeader) {
    throw new LucidError({
      type: "authorisation",
      message: "CSRF token mismatch",
    });
  }

  return true;
};
