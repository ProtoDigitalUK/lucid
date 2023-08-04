import { type Component, createSignal } from "solid-js";
// Actions
import Actions from "@/components/Actions";
// Components
import Form from "@/components/Groups/Form";
import Button from "@/components/Partials/Button";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm: Component<ResetPasswordFormProps> = (props) => {
  // ----------------------------------------
  // State
  const [password, setPassword] = createSignal("");
  const [passwordConfirmation, setPasswordConfirmation] = createSignal("");

  // ----------------------------------------
  // Render
  return (
    <Actions.Auth.ResetPassword>
      {(resetPassword) => (
        <Form.Root
          onSubmit={async () => {
            resetPassword.mutate({
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
            errors={resetPassword.errors?.errors?.body?.password}
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
            errors={resetPassword.errors?.errors?.body?.password_confirmation}
          />
          <div class="mt-10 w-full">
            <Button
              size="medium"
              loading={resetPassword.isLoading}
              classes="w-full"
              type="submit"
              theme="primary"
            >
              Reset Password
            </Button>
          </div>
        </Form.Root>
      )}
    </Actions.Auth.ResetPassword>
  );
};

export default ResetPasswordForm;
