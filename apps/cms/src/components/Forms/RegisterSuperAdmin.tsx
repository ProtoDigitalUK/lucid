import { type Component, createSignal, Show } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { Link, useNavigate } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
// Service
import api from "@/services/api";
// Components
import Form from "@/components/Partials/Form";
import Input from "@/components/Inputs/Input";
import Button from "@/components/Partials/Button";

interface RegisterSuperAdminProps {}

const RegisterSuperAdmin: Component<RegisterSuperAdminProps> = () => {
  // ----------------------------------------
  // State
  const [errors, setErrors] = createSignal<APIErrorResponse>();

  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  const navigate = useNavigate();

  // ----------------------------------------
  // Queries / Mutations
  const registerSuperAdmin = createMutation({
    mutationFn: api.auth.login,
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => validateSetError(error, setErrors),
  });

  // ----------------------------------------
  // Render
  return (
    <Form
      onSubmit={async () => {
        registerSuperAdmin.mutate({
          username: username(),
          password: password(),
        });
      }}
    >
      <div class="mb-14">
        <div class="grid grid-cols-2 gap-5">
          <Input
            id="firstName"
            name="first_name"
            type="text"
            value={firstName()}
            onChange={setFirstName}
            copy={{
              label: "First Name",
            }}
            required={true}
            autoFoucs={true}
            autoComplete="given-name"
            errors={errors()?.errors?.body?.first_name}
          />
          <Input
            id="lastName"
            name="last_name"
            type="text"
            value={lastName()}
            onChange={setLastName}
            copy={{
              label: "Last Name",
            }}
            required={true}
            autoComplete="family-name"
            errors={errors()?.errors?.body?.last_name}
          />
        </div>
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
          autoComplete="username"
          errors={errors()?.errors?.body?.username}
        />
      </div>
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
        autoComplete="email"
        errors={errors()?.errors?.body?.email}
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
        errors={errors()?.errors?.body?.password}
      />
      <div class="flex flex-col items-start">
        <div class="mt-10 w-full">
          <Show when={errors()}>
            <p class="text-red-500 text-sm mb-5">{errors()?.message}</p>
          </Show>

          <Button
            text="Register"
            classes="w-full"
            type="submit"
            colour="primary"
            loading={registerSuperAdmin.isLoading}
          />
        </div>
      </div>
    </Form>
  );
};

export default RegisterSuperAdmin;
