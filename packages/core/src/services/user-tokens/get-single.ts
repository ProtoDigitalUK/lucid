// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import UserToken, { UserTokenT } from "@db/models/UserToken";

export interface ServiceData {
  token_type: UserTokenT["token_type"];
  token: string;
}

const getSingle = async (data: ServiceData) => {
  const userToken = await UserToken.getByToken({
    token_type: data.token_type,
    token: data.token,
  });

  if (!userToken) {
    throw new LucidError({
      type: "basic",
      name: "Invalid token",
      message:
        "The provided token is either invalid or expired. Please try again.",
      status: 400,
    });
  }

  return userToken;
};

export default getSingle;
