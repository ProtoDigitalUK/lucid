import { type Component, createSignal, Show } from "solid-js";
import { Link } from "@solidjs/router";
// Actions
import Actions from "@/components/Actions";
// Components
import Form from "@/components/Groups/Form";
import Button from "@/components/Partials/Button";

interface ForgotPasswordFormProps {
  showBackToLogin?: boolean;
}

const ForgotPasswordForm: Component<ForgotPasswordFormProps> = ({
  showBackToLogin,
}) => {
  // ----------------------------------------
  // State
  const [email, setEmail] = createSignal("");

  // ----------------------------------------
  // Render
  return (
    <Actions.Auth.ForgotPassword
      onSuccess={() => {
        setEmail("");
      }}
    >
      {(forgotPassword) => (
        <Form.Root
          onSubmit={async () => {
            forgotPassword.mutate({ email: email() });
          }}
        >
          <Form.Input
            id="email"
            name="email"
            type="email"
            value={email()}
            onChange={setEmail}
            copy={{
              label: "Email",
            }}
            required={true}
            autoFoucs={true}
            errors={forgotPassword.errors?.errors?.body?.email}
          />

          <div class="flex flex-col items-start">
            <Show when={showBackToLogin}>
              <Link
                class="block text-sm mt-1 hover:text-secondaryH duration-200 transition-colors"
                type="button"
                href="/login"
              >
                Back to login
              </Link>
            </Show>
            <div class="mt-10 w-full">
              <Button
                size="medium"
                loading={forgotPassword.isLoading}
                classes="w-full"
                type="submit"
                theme="primary"
              >
                Send password reset
              </Button>
            </div>
          </div>
        </Form.Root>
      )}
    </Actions.Auth.ForgotPassword>
  );
};

export default ForgotPasswordForm;
