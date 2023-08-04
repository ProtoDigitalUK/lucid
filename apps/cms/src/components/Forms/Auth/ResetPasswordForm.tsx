import { type Component, createSignal } from "solid-js";
// Components
import Form from "@/components/Groups/Form";
import Button from "@/components/Partials/Button";
// Hooks
import Mutations from "@/hooks/mutations";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm: Component<ResetPasswordFormProps> = (props) => {
  // ----------------------------------------
  // State
  const [password, setPassword] = createSignal("");
  const [passwordConfirmation, setPasswordConfirmation] = createSignal("");

  // ----------------------------------------
  // Mutations
  const resetPassword = Mutations.Auth.useResetPassword();

  // ----------------------------------------
  // Render
  return (
    <Form.Root
      type="standard"
      state={{
        isLoading: resetPassword.action.isLoading,
        errors: resetPassword.errors(),
      }}
      content={{
        submit: "Reset Password",
      }}
      onSubmit={async () => {
        resetPassword.action.mutate({
          token: props.token,
          password: password(),
          password_confirmation: passwordConfirmation(),
        });
      }}
    >
      <Form.Input
        id="password"
        name="password"
        type="password"
        value={password()}
        onChange={setPassword}
        copy={{
          label: "Password",
        }}
        required={true}
        autoFoucs={true}
        errors={resetPassword.errors()?.errors?.body?.password}
      />
      <Form.Input
        id="password_confirmation"
        name="password_confirmation"
        type="password"
        value={passwordConfirmation()}
        onChange={setPasswordConfirmation}
        copy={{
          label: "Confirm Password",
        }}
        required={true}
        errors={resetPassword.errors()?.errors?.body?.password_confirmation}
      />
    </Form.Root>
  );
};

export default ResetPasswordForm;
