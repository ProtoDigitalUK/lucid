import { type Component, createSignal, Show } from "solid-js";
import { Link } from "@solidjs/router";
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
  // Render
  return (
    <Form>
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
        <Button
          text="Send reset link"
          classes="mt-10 w-full"
          type="submit"
          colour="primary"
        />
      </div>
    </Form>
  );
};

export default ForgotPasswordForm;
