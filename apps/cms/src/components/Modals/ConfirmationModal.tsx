import { Component, Show } from "solid-js";
// Components
import { FaSolidXmark } from "solid-icons/fa";
import { AlertDialog } from "@kobalte/core";
import Button from "@/components/Partials/Button";

interface ConfirmationModalProps {
  state: {
    open: boolean;
    setOpen: (open: boolean) => void;
  };
  content: {
    title: string;
    description?: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: Component<ConfirmationModalProps> = (props) => {
  // ------------------------------
  // Render
  return (
    <AlertDialog.Root
      open={props.state.open}
      onOpenChange={() => props.state.setOpen(!props.state.open)}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay class="fixed inset-0 bg-white bg-opacity-40" />
        <div class="fixed inset-0 z-50 flex items-center justify-center">
          <AlertDialog.Content class="z-50 max-w-2xl bg-container shadow-md p-30 rounded-md border-border border">
            <div class="flex items-baseline justify-between mb-15">
              <AlertDialog.Title>{props.content.title}</AlertDialog.Title>
              <AlertDialog.CloseButton class="alert-dialog__close-button">
                <FaSolidXmark />
              </AlertDialog.CloseButton>
            </div>
            <Show when={props.content.description}>
              <AlertDialog.Description>
                {props.content.description}
              </AlertDialog.Description>
            </Show>
            <div class="mt-15 pt-15 border-t border-border flex">
              <Button theme="danger" type={"button"}>
                Confirm
              </Button>
              <Button theme="primary" type={"button"} classes="ml-2.5">
                Cancel
              </Button>
            </div>
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default ConfirmationModal;
