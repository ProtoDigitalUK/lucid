import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
// Services
import Config from "@services/Config.js";
// Types
import { UserResT } from "@lucid/types/src/users.js";

export const generateJWT = (reply: FastifyReply, user: UserResT) => {
  const { id, email, username } = user;

  const payload: FastifyRequest["auth"] = {
    id,
    email,
    username,
  };

  const token = jwt.sign(payload, Config.secret, {
    expiresIn: "7d",
  });

  reply.setCookie("_jwt", token, {
    maxAge: 86400000 * 7,
    httpOnly: true,
    secure: Config.mode === "production",
    sameSite: "strict",
    path: "/",
  });
  reply.setCookie("auth", "true", {
    maxAge: 86400000 * 7,
    path: "/",
  });
};

export const verifyJWT = (request: FastifyRequest) => {
  try {
    // Assuming you have registered the fastify-cookie plugin
    const _jwt = request.cookies["_jwt"];

    if (!_jwt) {
      return {
        success: false,
        data: null,
      };
    }

    const decoded = jwt.verify(_jwt, Config.secret);

    return {
      success: true,
      data: decoded as FastifyRequest["auth"],
    };
  } catch (err) {
    return {
      success: false,
      data: null,
    };
  }
};

export const clearJWT = (reply: FastifyReply) => {
  reply.clearCookie("_jwt", { path: "/" }); // Path should match the one used when setting the cookie
  reply.clearCookie("auth", { path: "/" });
};

export default {
  generateJWT,
  verifyJWT,
  clearJWT,
};
