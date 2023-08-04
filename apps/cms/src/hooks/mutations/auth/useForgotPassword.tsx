import { createSignal, onCleanup } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// Services
import api from "@/services/api";

interface UseForgotPasswordProps {
  onSuccess?: () => void;
}

export const useForgotPassword = (props: UseForgotPasswordProps) => {
  // ----------------------------------------
  // States / Hooks
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
  // Return
  return {
    action: sendPasswordReset,
    errors: errors(),
  };
};
