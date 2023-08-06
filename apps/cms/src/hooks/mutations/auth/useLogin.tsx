import { createSignal, onCleanup } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// Services
import api from "@/services/api";
// Types
import { APIErrorResponse } from "@/types/api";

export const useLogin = () => {
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
  // Return
  return {
    action: login,
    errors: errors,
  };
};
