import { PoolClient } from "pg";
import { add } from "date-fns";
import C from "@root/constants.js";
// Utils
import service from "@utils/app/service.js";
// Serices
import userTokensServices from "@services/user-tokens/index.js";
import emailServices from "@services/email/index.js";
import usersServices from "@services/users/index.js";
import Config from "@services/Config.js";

export interface ServiceData {
  email: string;
}

const sendResetPassword = async (client: PoolClient, data: ServiceData) => {
  const successMessage = `If an account with that email exists, we've sent you an email with instructions to reset your password.`;

  // -------------------------------------------
  // Check if user exists
  const user = await service(
    usersServices.getSingleQuery,
    false,
    client
  )({
    email: data.email,
  });

  if (!user) {
    // We don't want to tell the user that the email doesn't exist in our database for security reasons.
    return {
      message: successMessage,
    };
  }

  // -------------------------------------------
  // Create a password reset token
  const expiryDate = add(new Date(), { hours: 1 }).toISOString();

  const userToken = await service(
    userTokensServices.createSingle,
    false,
    client
  )({
    user_id: user.id,
    token_type: "password_reset",
    expiry_date: expiryDate,
  });

  // -------------------------------------------
  // Send the password reset email
  await service(
    emailServices.sendInternal,
    false,
    client
  )({
    template: "reset-password",
    params: {
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        url: `${Config.host}${C.locations.resetPassword}?token=${userToken.token}`,
      },
      options: {
        to: user.email,
        subject: "Reset your password",
      },
    },
  });

  return {
    message: successMessage,
  };
};

export default sendResetPassword;
