import T from "@/translations";
import { Component, Show } from "solid-js";
// Components
import { FaSolidXmark } from "solid-icons/fa";
import { AlertDialog } from "@kobalte/core";
import Button from "@/components/Partials/Button";
import ErrorMessage from "@/components/Partials/ErrorMessage";

interface ConfirmationProps {
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

export const Confirmation: Component<ConfirmationProps> = (props) => {
  // ------------------------------
  // Render
  return (
    <AlertDialog.Root
      open={props.state.open}
      onOpenChange={() => props.state.setOpen(!props.state.open)}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay class="fixed inset-0 bg-primary bg-opacity-60 animate-animate-fade-out data-[expanded]:animate-animate-fade-in" />
        <div class="fixed inset-0 z-50 flex items-center justify-center p-15">
          <AlertDialog.Content class="z-50 max-w-2xl w-full bg-container shadow-md rounded-md border-border border">
            <div class="flex items-baseline justify-between p-15 md:p-30 border-b border-border">
              <AlertDialog.Title>{props.content.title}</AlertDialog.Title>
              <AlertDialog.CloseButton class="hover:fill-errorText h-8 w-8 min-w-[32px] rounded-full flex justify-center items-center bg-container hover:bg-error duration-200 transition-colors">
                <FaSolidXmark />
              </AlertDialog.CloseButton>
            </div>
            <div class="p-15 md:p-30">
              <Show when={props.content.description}>
                <AlertDialog.Description>
                  {props.content.description}
                </AlertDialog.Description>
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
                  theme="danger"
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
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};