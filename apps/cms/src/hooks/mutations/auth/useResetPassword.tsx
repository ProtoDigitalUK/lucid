import { createSignal, onCleanup } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// Services
import api from "@/services/api";

export const useResetPassword = () => {
  // ----------------------------------------
  // States / Hooks
  const navigate = useNavigate();
  const [errors, setErrors] = createSignal<APIErrorResponse>();

  // ----------------------------------------
  // Queries / Mutations
  const resetPassword = createMutation({
    mutationFn: api.auth.resetPassword,
    onSuccess: () => {
      spawnToast({
        title: "Password Reset",
        message: "Your password has been reset successfully",
        status: "success",
      });
      setErrors(undefined);
      navigate("/login");
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
    action: resetPassword,
    errors: errors,
  };
};
