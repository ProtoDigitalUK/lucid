import { type Component, createSignal, Show } from "solid-js";
import { Link } from "@solidjs/router";
// Actions
import Actions from "@/components/Actions";
// Components
import Form from "@/components/Groups/Form";
import Button from "@/components/Partials/Button";
import ErrorMessage from "@/components/Partials/ErrorMessage";

interface LoginFormProps {
  showForgotPassword?: boolean;
}

const LoginForm: Component<LoginFormProps> = ({ showForgotPassword }) => {
  // ----------------------------------------
  // State
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  // ----------------------------------------
  // Render
  return (
    <Actions.Auth.Login>
      {(login) => (
        <Form.Root
          onSubmit={async () => {
            login.mutate({ username: username(), password: password() });
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
            errors={login.errors?.errors?.body?.username}
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
            errors={login.errors?.errors?.body?.password}
          />
          <div class="flex flex-col items-start">
            <Show when={showForgotPassword}>
              <Link
                class="block text-sm mt-1 hover:text-secondaryH duration-200 transition-colors"
                type="button"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </Show>

            <div class="mt-10 w-full">
              <Show when={login.errors && login.errors?.message}>
                <ErrorMessage
                  theme="container"
                  message={login.errors?.message}
                />
              </Show>

              <Button
                size="medium"
                classes="w-full"
                type="submit"
                theme="primary"
                loading={login.isLoading}
              >
                Login
              </Button>
            </div>
          </div>
        </Form.Root>
      )}
    </Actions.Auth.Login>
  );
};

export default LoginForm;
