import T from "@/translations";
import { Component } from "solid-js";
// Components
import Modal from "@/components/Groups/Modal";
// Services
import api from "@/services/api";

interface ClearAllProcessedImagesProps {
  state: {
    open: boolean;
    setOpen: (_open: boolean) => void;
  };
}

const ClearAllProcessedImages: Component<ClearAllProcessedImagesProps> = (
  props
) => {
  // ----------------------------------------
  // Mutations
  const clearAllProcessedImages = api.media.useDeleteAllProcessedImages({
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
        isLoading: clearAllProcessedImages.action.isPending,
        isError: clearAllProcessedImages.action.isError,
      }}
      content={{
        title: T("clear_all_processed_images_modal_title"),
        description: T("clear_all_processed_images_modal_description"),
        error: clearAllProcessedImages.errors()?.message,
      }}
      onConfirm={() => {
        clearAllProcessedImages.action.mutate({});
      }}
      onCancel={() => {
        props.state.setOpen(false);
        clearAllProcessedImages.reset();
      }}
    />
  );
};

export default ClearAllProcessedImages;
