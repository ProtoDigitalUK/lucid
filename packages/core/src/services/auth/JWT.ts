import { Response, Request } from "express";
import jwt from "jsonwebtoken";
// Services
import Config from "@services/Config";
// Format
import { UserResT } from "@utils/format/format-user";

export const generateJWT = (res: Response, user: UserResT) => {
  const { id, email, username } = user;

  const payload: Request["auth"] = {
    id,
    email,
    username,
  };

  const token = jwt.sign(payload, Config.secret, {
    expiresIn: "7d",
  });

  res.cookie("_jwt", token, {
    maxAge: 86400000 * 7,
    httpOnly: true,
    secure: Config.mode === "production",
    sameSite: "strict",
  });
  res.cookie("auth", true, {
    maxAge: 86400000 * 7,
  });
};

export const verifyJWT = (req: Request) => {
  try {
    const { _jwt } = req.cookies;

    if (!_jwt) {
      return {
        sucess: false,
        data: null,
      };
    }

    const decoded = jwt.verify(_jwt, Config.secret);

    return {
      sucess: true,
      data: decoded as Request["auth"],
    };
  } catch (err) {
    return {
      sucess: false,
      data: null,
    };
  }
};

export const clearJWT = (res: Response) => {
  res.clearCookie("_jwt");
  res.clearCookie("auth");
};

export default {
  generateJWT,
  verifyJWT,
  clearJWT,
};
