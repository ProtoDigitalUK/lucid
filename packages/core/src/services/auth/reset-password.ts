import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service";
// Serices
import userTokensServices from "@services/user-tokens";
import emailServices from "@services/email";
import userServices from "@services/users";

export interface ServiceData {
  token: string;
  password: string;
}

const resetPassword = async (client: PoolClient, data: ServiceData) => {
  const successMessage = `You have successfully reset your password. Please login with your new password.`;

  // -------------------------------------------
  // Check if token exists
  const userToken = await service(
    userTokensServices.getSingle,
    false,
    client
  )({
    token_type: "password_reset",
    token: data.token,
  });

  // -------------------------------------------
  // Update the user's password
  const user = await service(
    userServices.updateSingle,
    false,
    client
  )({
    user_id: userToken.user_id,
    password: data.password,
  });

  // -------------------------------------------
  // Delete the token
  await service(
    userTokensServices.deleteSingle,
    false,
    client
  )({
    id: userToken.id,
  });

  // -------------------------------------------
  // Send the password reset email
  await service(
    emailServices.sendEmailInternal,
    false,
    client
  )({
    template: "password-reset",
    params: {
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
      },
      options: {
        to: user.email,
        subject: "Your password has been reset",
      },
    },
  });

  return {
    message: successMessage,
  };
};

export default resetPassword;
