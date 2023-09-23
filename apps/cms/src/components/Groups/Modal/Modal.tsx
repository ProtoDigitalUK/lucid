import T from "@/translations";
import { Component, Show } from "solid-js";
// Components
import { FaSolidXmark } from "solid-icons/fa";
import { Dialog } from "@kobalte/core";
import Button from "@/components/Partials/Button";
import ErrorMessage from "@/components/Partials/ErrorMessage";

interface ModalProps {
  state: {
    open: boolean;
    setOpen: (_open: boolean) => void;
    isLoading?: boolean;
    isError?: boolean;
  };
  content: {
    title: string;
    description?: string;
    error?: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export const Modal: Component<ModalProps> = (props) => {
  // ------------------------------
  // Render
  return (
    <Dialog.Root
      open={props.state.open}
      onOpenChange={() => props.state.setOpen(!props.state.open)}
    >
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 bg-primary bg-opacity-60 animate-animate-fade-out data-[expanded]:animate-animate-fade-in" />
        <div class="fixed inset-0 z-50 flex items-center justify-center p-15">
          <Dialog.Content class="z-50 max-w-2xl w-full bg-container shadow-md rounded-md border-border border">
            <div class="flex items-baseline justify-between p-15 md:p-30 border-b border-border">
              <Dialog.Title>{props.content.title}</Dialog.Title>
              <Dialog.CloseButton class="hover:fill-errorText h-8 w-8 min-w-[32px] rounded-full flex justify-center items-center bg-container hover:bg-error duration-200 transition-colors">
                <FaSolidXmark />
              </Dialog.CloseButton>
            </div>
            <div class="p-15 md:p-30">
              <Show when={props.content.description}>
                <Dialog.Description>
                  {props.content.description}
                </Dialog.Description>
              </Show>
            </div>
            <div class="p-15 md:p-30 border-t border-border ">
              <Show when={props.state.isError && props.content.error}>
                <div class="mb-5">
                  <ErrorMessage theme="basic" message={props.content.error} />
                </div>
              </Show>
              <div class="flex">
                <Button
                  theme={"primary"}
                  size="small"
                  type={"button"}
                  loading={props.state.isLoading}
                  onClick={props.onConfirm}
                >
                  {T("confirm")}
                </Button>
                <Button
                  theme="container-outline"
                  size="small"
                  type={"button"}
                  classes="ml-2.5"
                  disabled={props.state.isLoading}
                  onClick={props.onCancel}
                >
                  {T("cancel")}
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
