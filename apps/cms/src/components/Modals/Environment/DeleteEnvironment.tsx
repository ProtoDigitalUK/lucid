import { Component } from "solid-js";
// Actions
import Actions from "@/components/Actions";
// Components
import Modal from "@/components/Groups/Modal";

interface DeleteEnvironmentProps {
  key?: string;
  state: {
    open: boolean;
    setOpen: (open: boolean) => void;
  };
}

const DeleteEnvironment: Component<DeleteEnvironmentProps> = (props) => {
  // ------------------------------
  // Render
  return (
    <Actions.Environment.Delete
      onSuccess={() => {
        props.state.setOpen(false);
      }}
    >
      {(deleteEnv) => (
        <Modal.Confirmation
          state={{
            open: props.state.open,
            setOpen: props.state.setOpen,
            isLoading: deleteEnv.isLoading,
            isError: deleteEnv.isError,
          }}
          content={{
            title: "Delete environment",
            description: "Are you sure you want to delete this environment?",
            error: deleteEnv.errors?.message,
          }}
          onConfirm={() => {
            if (!props.key) return console.error("No key provided");

            deleteEnv.mutate({
              key: props.key,
            });
          }}
          onCancel={() => {
            props.state.setOpen(false);
          }}
        />
      )}
    </Actions.Environment.Delete>
  );
};

export default DeleteEnvironment;
