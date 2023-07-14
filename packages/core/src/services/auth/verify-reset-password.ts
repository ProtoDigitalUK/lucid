// Serices
import userTokensServices from "@services/user-tokens";

export interface ServiceData {
  token: string;
}

/*
  Verifies if the token is valid and returns the users email and a message
*/

const verifyResetPassword = async (data: ServiceData) => {
  // -------------------------------------------
  // Verified the token exists and is valid

  await userTokensServices.getSingle({
    token_type: "password_reset",
    token: data.token,
  });

  return {};
};

export default verifyResetPassword;
