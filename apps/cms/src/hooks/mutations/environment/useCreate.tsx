import { createSignal, onCleanup } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// State
import { setEnvironment } from "@/state/environment";
// Services
import api from "@/services/api";

export const useCreate = () => {
  // ----------------------------------------
  // States / Hooks
  const navigate = useNavigate();
  const [errors, setErrors] = createSignal<APIErrorResponse>();
  const queryClient = useQueryClient();

  // ----------------------------------------
  // Queries / Mutations
  const createEnvironment = createMutation({
    mutationFn: api.environments.createSingle,
    onSuccess: (data) => {
      spawnToast({
        title: "Environment Created",
        message: "Your environment has been created successfully.",
        status: "success",
      });
      setEnvironment(data.data.key);
      navigate(`/env/${data.data.key}`);

      queryClient.invalidateQueries(["environments.getAll"]);
      queryClient.invalidateQueries(["environments.collections.getAll"]);
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
    action: createEnvironment,
    errors: errors,
  };
};
