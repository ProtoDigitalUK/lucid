import { createSignal, onCleanup } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// State
import { setEnvironment, environment } from "@/state/environment";
// Services
import api from "@/services/api";
// Types
import { APIErrorResponse } from "@/types/api";

interface UseDeleteProps {
  onSuccess?: () => void;
}

export const useDelete = (props: UseDeleteProps) => {
  // ----------------------------------------
  // States / Hooks
  const navigate = useNavigate();
  const [errors, setErrors] = createSignal<APIErrorResponse>();
  const queryClient = useQueryClient();

  // ----------------------------------------
  // Queries / Mutations
  const deleteEnvironment = createMutation({
    mutationFn: api.environments.deleteSingle,
    onSuccess: (data) => {
      spawnToast({
        title: "Environment Deleted",
        message: "Your environment has been deleted.",
        status: "success",
      });
      setErrors(undefined);

      if (data.data.key === environment()) {
        setEnvironment(undefined);
        navigate("/");
      }

      props.onSuccess?.();

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
    action: deleteEnvironment,
    errors: errors,
  };
};
