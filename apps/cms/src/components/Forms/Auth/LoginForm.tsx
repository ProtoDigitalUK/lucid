import { type Component, createSignal, Show } from "solid-js";
import { Link } from "@solidjs/router";
// Components
import Form from "@/components/Groups/Form";
import Button from "@/components/Partials/Button";
import ErrorMessage from "@/components/Partials/ErrorMessage";
// Hooks
import Mutations from "@/hooks/mutations";

interface LoginFormProps {
  showForgotPassword?: boolean;
}

const LoginForm: Component<LoginFormProps> = ({ showForgotPassword }) => {
  // ----------------------------------------
  // State
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  // ----------------------------------------
  // Mutations
  const login = Mutations.Auth.useLogin();

  // ----------------------------------------
  // Render
  return (
    <Form.Root
      type="standard"
      state={{
        isLoading: login.action.isLoading,
        errors: login.errors(),
      }}
      content={{
        submit: "Login",
      }}
      onSubmit={async () => {
        login.action.mutate({ username: username(), password: password() });
      }}
    >
      <Form.Input
        id="username"
        name="username"
        type="text"
        value={username()}
        onChange={setUsername}
        copy={{
          label: "Username",
        }}
        required={true}
        autoFoucs={true}
        autoComplete="username"
        errors={login.errors()?.errors?.body?.username}
      />
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
        autoComplete="current-password"
        errors={login.errors()?.errors?.body?.password}
      />
      <Show when={showForgotPassword}>
        <Link
          class="block text-sm mt-1 hover:text-secondaryH duration-200 transition-colors"
          type="button"
          href="/forgot-password"
        >
          Forgot password?
        </Link>
      </Show>
    </Form.Root>
  );
};

export default LoginForm;
