// Serices
import userTokensServices from "@services/user-tokens";
import emailServices from "@services/email";
import userServices from "@services/users";

export interface ServiceData {
  token: string;
  password: string;
}

const resetPassword = async (data: ServiceData) => {
  const successMessage = `You have successfully reset your password. Please login with your new password.`;

  // -------------------------------------------
  // Check if token exists
  const userToken = await userTokensServices.getSingle({
    token_type: "password_reset",
    token: data.token,
  });

  // -------------------------------------------
  // Check if user exists and get them
  const user = await userServices.updatePassword({
    user_id: userToken.user_id,
    password: data.password,
  });

  // -------------------------------------------
  // Delete the token
  await userTokensServices.deleteSingle({
    id: userToken.id,
  });

  // -------------------------------------------
  // Send the password reset email
  await emailServices.sendEmailInternal("password-reset", {
    data: {
      first_name: user.first_name,
      last_name: user.last_name,
    },
    options: {
      to: user.email,
      subject: "Your password has been reset",
    },
  });

  return {
    message: successMessage,
  };
};

export default resetPassword;
