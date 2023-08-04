import {
  Component,
  JSXElement,
  createMemo,
  createSignal,
  onCleanup,
} from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// State
import { setEnvironment } from "@/state/environment";
// Services
import api from "@/services/api";

interface CreateUpdateProps {
  children: (props: {
    mutate: {
      create: (
        props: Parameters<typeof api.environments.createSingle>[0]
      ) => void;
      update: (
        props: Parameters<typeof api.environments.updateSingle>[0]
      ) => void;
    };
    isLoading: boolean;
    isError: boolean;
    errors: APIErrorResponse | undefined;
  }) => JSXElement;
}

export const CreateUpdate: Component<CreateUpdateProps> = (props) => {
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
  // Memos
  const isLoading = createMemo(() => {
    return createEnvironment.isLoading || updateEnvironment.isLoading;
  });
  const isError = createMemo(() => {
    return createEnvironment.isError || updateEnvironment.isError;
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
        mutate: {
          create: createEnvironment.mutate,
          update: updateEnvironment.mutate,
        },
        isLoading: isLoading(),
        isError: isError(),
        errors: errors(),
      })}
    </>
  );
};
