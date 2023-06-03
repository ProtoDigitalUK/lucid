import { Request, Response } from "express";
import Config from "@db/models/Config";

export const generateCSRFToken = (res: Response) => {
  // create a random string for CSRF token
  const token = crypto.getRandomValues(new Uint8Array(32)).join("");

  // store the CSRF token a httpOnly cookie,
  res.cookie("_csrf", token, {
    maxAge: 86400000 * 7,
    httpOnly: true,
    secure: Config.environment === "production",
    sameSite: "strict",
  });

  return token;
};

export const verifyCSRFToken = (req: Request) => {
  const { _csrf } = req.cookies;
  const { _csrf: CSRFHeader } = req.headers;

  if (!_csrf || !CSRFHeader) return false;
  if (_csrf !== CSRFHeader) return false;

  return true;
};

export const clearCSRFToken = (res: Response) => {
  res.clearCookie("_csrf");
};
