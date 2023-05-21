import { Request } from "express";
import jwt from "jsonwebtoken";
import { LucidError } from "@utils/error-handler";
import Config from "@db/models/Config";
import { UserT } from "@db/models/User";

interface JWTData {
  id: string;
  email: string;
  username: string;
}

const generateJWT = (req: Request, user: UserT) => {
  const { id, email, username } = user;

  const payload: JWTData = {
    id,
    email,
    username,
  };

  const token = jwt.sign(payload, Config.secret, {
    expiresIn: "7d",
  });

  req.cookies.set("JWT", token, {
    httpOnly: true,
    secure: Config.environment === "production",
    sameSite: "strict",
  });
};

const verifyJWT = (req: Request) => {
  const { JWT } = req.cookies;

  if (!JWT) {
    throw new LucidError({
      type: "authorisation",
      message: "JWT token missing",
    });
  }

  try {
    const decoded = jwt.verify(JWT, Config.secret);
    return decoded as JWTData;
  } catch (err) {
    throw new LucidError({
      type: "authorisation",
      message: "JWT token invalid",
    });
  }
};

export { generateJWT, verifyJWT };
