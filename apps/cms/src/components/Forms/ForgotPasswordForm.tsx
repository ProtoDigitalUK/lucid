import { type Component, createSignal, Show } from "solid-js";
import { Link } from "@solidjs/router";
import { createMutation } from "@tanstack/solid-query";
import spawnToast from "@/utils/spawn-toast";
// Utils
import { validateSetError } from "@/utils/error-handling";
// Service
import api from "@/services/api";
// Components
import Form from "@/components/Partials/Form";
import Input from "@/components/Inputs/Input";
import Button from "@/components/Partials/Button";

interface ForgotPasswordFormProps {
  showBackToLogin?: boolean;
}

const ForgotPasswordForm: Component<ForgotPasswordFormProps> = ({
  showBackToLogin,
}) => {
  // ----------------------------------------
  // State
  const [errors, setErrors] = createSignal<APIErrorResponse>();
  const [email, setEmail] = createSignal("");

  // ----------------------------------------
  // Queries / Mutations
  const sendPasswordReset = createMutation({
    mutationFn: api.auth.sendPasswordReset,
    onSuccess: () => {
      spawnToast({
        title: "Password reset email sent",
        message: "Please check your email for a password reset link",
        status: "success",
      });
      setEmail("");
    },
    onError: (error) => validateSetError(error, setErrors),
  });

  // ----------------------------------------
  // Render
  return (
    <Form
      onSubmit={async () => {
        sendPasswordReset.mutate({ email: email() });
      }}
    >
      <Input
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
        errors={errors()?.errors?.body?.email}
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
            loading={sendPasswordReset.isLoading}
            classes="w-full"
            type="submit"
            colour="primary"
          >
            Send password reset
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default ForgotPasswordForm;
