import { createSignal, onCleanup } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// Services
import api from "@/services/api";

export const useUpdate = () => {
  // ----------------------------------------
  // States / Hooks
  const [errors, setErrors] = createSignal<APIErrorResponse>();
  const queryClient = useQueryClient();

  // ----------------------------------------
  // Queries / Mutations
  const updateEnvironment = createMutation({
    mutationFn: api.environments.updateSingle,
    onSuccess: () => {
      spawnToast({
        title: "Environment Updated",
        message: "Your environment has been updated successfully.",
        status: "success",
      });
      setErrors(undefined);

      queryClient.invalidateQueries(["environments.getSingle"]);
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
    action: updateEnvironment,
    errors: errors(),
  };
};
