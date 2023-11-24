import T from "@/translations";
import { type Component, createSignal, Show } from "solid-js";
import { Link } from "@solidjs/router";
// Services
import api from "@/services/api";
// Components
import Form from "@/components/Groups/Form";

interface ForgotPasswordFormProps {
  showBackToLogin?: boolean;
}

const ForgotPasswordForm: Component<ForgotPasswordFormProps> = (props) => {
  // ----------------------------------------
  // State
  const [email, setEmail] = createSignal("");

  // ----------------------------------------
  // Mutations
  const forgotPassword = api.auth.useForgotPassword({
    onSuccess: () => {
      setEmail("");
    },
  });

  // ----------------------------------------
  // Render
  return (
    <Form.Root
      type="standard"
      state={{
        isLoading: forgotPassword.action.isPending,
        errors: forgotPassword.errors(),
      }}
      content={{
        submit: T("send_password_reset"),
      }}
      onSubmit={() => {
        forgotPassword.action.mutate({ email: email() });
      }}
    >
      <Form.Input
        id="email"
        name="email"
        type="email"
        value={email()}
        onChange={setEmail}
        copy={{
          label: T("email"),
        }}
        required={true}
        autoFoucs={true}
        errors={forgotPassword.errors()?.errors?.body?.email}
      />
      <Show when={props.showBackToLogin}>
        <Link
          class="block text-sm mt-1 hover:text-secondaryH duration-200 transition-colors"
          type="button"
          href="/login"
        >
          {T("back_to_login")}
        </Link>
      </Show>
    </Form.Root>
  );
};

export default ForgotPasswordForm;
