import { Component, JSXElement, createSignal, onCleanup } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// Services
import api from "@/services/api";

interface LoginProps {
  children: (props: {
    mutate: (data: Parameters<typeof api.auth.login>[0]) => void;
    isLoading: boolean;
    isError: boolean;
    errors: APIErrorResponse | undefined;
  }) => JSXElement;
}

export const Login: Component<LoginProps> = (props) => {
  // ----------------------------------------
  // States / Hooks
  const navigate = useNavigate();
  const [errors, setErrors] = createSignal<APIErrorResponse>();

  // ----------------------------------------
  // Queries / Mutations
  const login = createMutation({
    mutationFn: api.auth.login,
    onSuccess: () => {
      spawnToast({
        title: "Login successful",
        message: "You have been logged in",
        status: "success",
      });
      navigate("/");
      setErrors(undefined);
    },
    onError: (error) => validateSetError(error, setErrors),
  });

  // ----------------------------------------
  // On Cleanup
  onCleanup(() => {
    setErrors(undefined);
  });

  // ----------------------------------------
  // Render
  return (
    <>
      {props.children({
        mutate: login.mutate,
        isLoading: login.isLoading,
        isError: login.isError,
        errors: errors(),
      })}
    </>
  );
};
