import { type Component, createSignal, Show, createEffect } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { Link } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
// Service
import api from "@/services/api";
// Components
import Form from "@/components/Partials/Form";
import Input from "@/components/Inputs/Input";
import Button from "@/components/Partials/Button";

interface LoginFormProps {
  showForgotPassword?: boolean;
}

const LoginForm: Component<LoginFormProps> = ({ showForgotPassword }) => {
  // ----------------------------------------
  // State
  const [errors, setErrors] = createSignal<APIErrorResponse>();
  const [loading, setLoading] = createSignal(false);

  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  // ----------------------------------------
  // Queries / Mutations
  const login = createMutation({
    mutationFn: api.auth.login,
    onSuccess: (data) => {
      console.log("Login successful", data);
    },
    onError: (error) => validateSetError(error, setErrors),
  });

  // ----------------------------------------
  // Effects
  createEffect(
    () => {
      setLoading(login.isLoading);
    },
    { defer: true }
  );

  // ----------------------------------------
  // Render
  return (
    <Form
      onSubmit={async () => {
        login.mutate({ username: username(), password: password() });
      }}
    >
      <Input
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
        errors={errors}
      />
      <Input
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
        errors={errors}
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

        <Button
          text="Login"
          classes="mt-10 w-full"
          type="submit"
          colour="primary"
          loading={loading}
        />
      </div>
    </Form>
  );
};

export default LoginForm;
