import T from "@/translations";
import { Component, Accessor } from "solid-js";
// Components
import Modal from "@/components/Groups/Modal";
// Services
import api from "@/services/api";

interface DeleteUserProps {
  id: Accessor<number | undefined>;
  state: {
    open: boolean;
    setOpen: (_open: boolean) => void;
  };
}

const DeleteUser: Component<DeleteUserProps> = (props) => {
  // ----------------------------------------
  // Mutations
  const deleteUser = api.users.useDeleteSingle({
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
        isLoading: deleteUser.action.isPending,
        isError: deleteUser.action.isError,
      }}
      content={{
        title: T("delete_user_modal_title"),
        description: T("delete_user_modal_description"),
        error: deleteUser.errors()?.message,
      }}
      onConfirm={() => {
        const id = props.id();
        if (!id) return console.error("No id provided");
        deleteUser.action.mutate({
          id: id,
        });
      }}
      onCancel={() => {
        props.state.setOpen(false);
        deleteUser.reset();
      }}
    />
  );
};

export default DeleteUser;
