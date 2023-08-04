import { Component, JSXElement, createSignal, onCleanup } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// Services
import api from "@/services/api";

interface ForgotPasswordProps {
  onSuccess?: () => void;

  children: (props: {
    mutate: (data: Parameters<typeof api.auth.sendPasswordReset>[0]) => void;
    isLoading: boolean;
    isError: boolean;
    errors: APIErrorResponse | undefined;
  }) => JSXElement;
}

export const ForgotPassword: Component<ForgotPasswordProps> = (props) => {
  // ----------------------------------------
  // States / Hooks
  const navigate = useNavigate();
  const [errors, setErrors] = createSignal<APIErrorResponse>();

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
      setErrors(undefined);
      props.onSuccess?.();
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
        mutate: sendPasswordReset.mutate,
        isLoading: sendPasswordReset.isLoading,
        isError: sendPasswordReset.isError,
        errors: errors(),
      })}
    </>
  );
};
