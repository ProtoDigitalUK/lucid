import { Component } from "solid-js";
// Components
import ConfirmationModal from "@/components/Modals/ConfirmationModal";

interface DeleteEnvironmentProps {
  state: {
    open: boolean;
    setOpen: (open: boolean) => void;
  };
}

const DeleteEnvironment: Component<DeleteEnvironmentProps> = (props) => {
  // ------------------------------
  // Render
  return (
    <ConfirmationModal
      state={props.state}
      content={{
        title: "Delete Environment",
        description:
          "Are you sure you want to delete this environment? This action cannot be undone.",
      }}
      onConfirm={() => {
        console.log("Confirm");
      }}
      onCancel={() => {
        console.log("Cancel");
      }}
    />
  );
};

export default DeleteEnvironment;
