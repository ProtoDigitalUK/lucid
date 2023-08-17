import { Component } from "solid-js";
// Components
import Modal from "@/components/Groups/Modal";
// Services
import api from "@/services/api";

interface DeleteEnvironmentProps {
  key?: string;
  state: {
    open: boolean;
    setOpen: (_open: boolean) => void;
  };
}

const DeleteEnvironment: Component<DeleteEnvironmentProps> = (props) => {
  // ----------------------------------------
  // Mutations
  const deleteEnvironment = api.environments.useDeleteSingle({
    onSuccess: () => {
      props.state.setOpen(false);
    },
  });

  // ------------------------------
  // Render
  return (
    <Modal.Confirmation
      state={{
        open: props.state.open,
        setOpen: props.state.setOpen,
        isLoading: deleteEnvironment.action.isLoading,
        isError: deleteEnvironment.action.isError,
      }}
      content={{
        title: "Delete environment",
        description: "Are you sure you want to delete this environment?",
        error: deleteEnvironment.errors()?.message,
      }}
      onConfirm={() => {
        if (!props.key) return console.error("No key provided");

        deleteEnvironment.action.mutate({
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
