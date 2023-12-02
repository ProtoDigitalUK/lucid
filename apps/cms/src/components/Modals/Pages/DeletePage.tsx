import T from "@/translations";
import { Component, Accessor } from "solid-js";
// Components
import Modal from "@/components/Groups/Modal";
// Stores
import { environment } from "@/store/environmentStore";
// Types
import type { CollectionResT } from "@headless/types/src/collections";
// Services
import api from "@/services/api";

interface DeletePageProps {
  id: Accessor<number | undefined> | number | undefined;
  collection: CollectionResT;
  state: {
    open: boolean;
    setOpen: (_open: boolean) => void;
  };
  callbacks?: {
    onSuccess?: () => void;
  };
}

const DeletePage: Component<DeletePageProps> = (props) => {
  // ----------------------------------------
  // Mutations
  const deletePage = api.environment.collections.pages.useDeleteSingle({
    onSuccess: () => {
      props.state.setOpen(false);
      if (props.callbacks?.onSuccess) props.callbacks.onSuccess();
    },
    collectionName: props.collection.singular,
  });

  // ------------------------------
  // Render
  return (
    <Modal.Confirmation
      state={{
        open: props.state.open,
        setOpen: props.state.setOpen,
        isLoading: deletePage.action.isPending,
        isError: deletePage.action.isError,
      }}
      content={{
        title: T("delete_page_modal_title", {
          name: props.collection.singular,
        }),
        description: T("delete_page_modal_description", {
          name: {
            value: props.collection.singular,
            toLowerCase: true,
          },
        }),
        error: deletePage.errors()?.message,
      }}
      onConfirm={() => {
        const id = typeof props.id === "function" ? props.id() : props.id;
        if (!id) return console.error("No id provided");
        deletePage.action.mutate({
          id: id,
          headers: {
            "headless-environment": environment() || "",
          },
        });
      }}
      onCancel={() => {
        props.state.setOpen(false);
        deletePage.reset();
      }}
    />
  );
};

export default DeletePage;
