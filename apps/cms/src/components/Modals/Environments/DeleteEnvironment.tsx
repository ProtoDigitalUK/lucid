import { Component, createSignal } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Services
import api from "@/services/api";
// State
import { environment, setEnvironment } from "@/state/environment";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// Components
import ConfirmationModal from "@/components/Modals/ConfirmationModal";

interface DeleteEnvironmentProps {
  key?: string;
  state: {
    open: boolean;
    setOpen: (open: boolean) => void;
  };
}

const DeleteEnvironment: Component<DeleteEnvironmentProps> = (props) => {
  // ------------------------------
  // State
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [errors, setErrors] = createSignal<APIErrorResponse>();

  // ------------------------------
  // Mutations
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

      props.state.setOpen(false);

      queryClient.invalidateQueries(["environments.getAll"]);
      queryClient.invalidateQueries(["environments.collections.getAll"]);
    },
    onError: (error) => validateSetError(error, setErrors),
  });

  // ------------------------------
  // Render
  return (
    <ConfirmationModal
      state={{
        open: props.state.open,
        setOpen: props.state.setOpen,
        isLoading: deleteEnvironment.isLoading,
        isError: deleteEnvironment.isError,
      }}
      content={{
        title: "Delete environment",
        description: "Are you sure you want to delete this environment?",
        error: errors()?.message,
      }}
      onConfirm={() => {
        if (!props.key) return console.error("No key provided");

        deleteEnvironment.mutate({
          key: props.key,
        });
      }}
      onCancel={() => {
        props.state.setOpen(false);
      }}
    />
  );
};

export default DeleteEnvironment;
