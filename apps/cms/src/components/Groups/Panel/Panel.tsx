import T from "@/translations";
import {
  Component,
  JSXElement,
  Show,
  onMount,
  createSignal,
  Switch,
  Match,
  createEffect,
} from "solid-js";
import { FaSolidArrowLeft } from "solid-icons/fa";
// Assets
import notifyIllustration from "@/assets/illustrations/notify.svg";
// Types
import { APIErrorResponse } from "@/types/api";
// Components
import { Dialog } from "@kobalte/core";
import Loading from "@/components/Partials/Loading";
import Error from "@/components/Partials/Error";
import Button from "@/components/Partials/Button";
import ErrorMessage from "@/components/Partials/ErrorMessage";

interface PanelProps {
  open: boolean;
  setOpen: (_open: boolean) => void;
  onSubmit?: () => void;

  fetchState?: {
    isLoading?: boolean;
    isError?: boolean;
  };
  mutateState?: {
    isLoading?: boolean;
    isError?: boolean;
    isDisabled?: boolean;
    errors: APIErrorResponse | undefined;
  };
  content: {
    title: string;
    description?: string;
    fetchError?: string;
    submit?: string;
  };
  children: JSXElement;
}

export const Panel: Component<PanelProps> = (props) => {
  // ------------------------------
  // State
  const [getBodyMinHeight, setBodyMinHeight] = createSignal(0);

  // ------------------------------
  // Refs
  let headerRef: HTMLDivElement | undefined;
  let footerRef: HTMLDivElement | undefined;

  // ------------------------------
  // Functions
  const setBodyHeightValue = () => {
    setTimeout(() => {
      if (headerRef && footerRef) {
        setBodyMinHeight(headerRef.offsetHeight + footerRef.offsetHeight);
      }
    });
  };

  // ------------------------------
  // Mount
  onMount(() => {
    setBodyHeightValue();
  });

  // ------------------------------
  // Effects
  createEffect(() => {
    if (props.open) setBodyHeightValue();
  });

  // ------------------------------
  // Render
  return (
    <Dialog.Root
      open={props.open}
      onOpenChange={() => props.setOpen(!props.open)}
    >
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 bg-primary bg-opacity-60 animate-animate-fade-out data-[expanded]:animate-animate-fade-in" />
        <div class="fixed inset-0 z-50 flex justify-end">
          <Dialog.Content class="w-full max-w-[800px] bg-white animate-animate-slide-from-right-out data-[expanded]:animate-animate-slide-from-right-in outline-none overflow-y-auto">
            <div
              ref={headerRef}
              class="bg-background p-30 border-b border-border"
            >
              <div class="w-full mb-2.5">
                <Dialog.CloseButton class="flex items-center text-sm text-title">
                  <FaSolidArrowLeft class="fill-title mr-2" />
                  back
                </Dialog.CloseButton>
              </div>
              <Switch>
                <Match when={props.fetchState?.isLoading}>
                  <div class="w-full">
                    <div class="h-8 skeleton w-1/4" />
                    <div class="h-6 skeleton w-full mt-2" />
                  </div>
                </Match>
                <Match when={!props.fetchState?.isLoading}>
                  <Dialog.Title>{props.content.title}</Dialog.Title>
                  <Show when={props.content.description}>
                    <Dialog.Description class="block mt-1">
                      {props.content.description}
                    </Dialog.Description>
                  </Show>
                </Match>
              </Switch>
            </div>
            <div
              class="p-30 relative"
              style={{
                "min-height": `calc(100vh - ${getBodyMinHeight()}px)`,
              }}
            >
              <Switch>
                <Match
                  when={
                    !props.fetchState?.isLoading && !props.fetchState?.isError
                  }
                >
                  <form
                    class="w-full"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (props.onSubmit) props.onSubmit();
                    }}
                  >
                    {props.children}
                  </form>
                </Match>
                <Match when={props.fetchState?.isLoading}>
                  <Loading type="fill" />
                </Match>
                <Match when={props.fetchState?.isError}>
                  <div class="min-h-[300px]">
                    <Error
                      type={"fill"}
                      content={{
                        image: notifyIllustration,
                        title: props.content.fetchError || T("error_title"),
                        description: props.content.fetchError
                          ? ""
                          : T("error_message"),
                      }}
                    />
                  </div>
                </Match>
              </Switch>
            </div>
            <div ref={footerRef} class="p-30 border-t">
              <Show
                when={
                  props.mutateState?.errors &&
                  props.mutateState?.errors?.message
                }
              >
                <ErrorMessage
                  theme="background"
                  message={props.mutateState?.errors?.message}
                />
              </Show>
              <div class="flex justify-end">
                <Button
                  size="medium"
                  theme="container-outline"
                  onClick={() => props.setOpen(false)}
                >
                  {T("close")}
                </Button>
                <Show when={props.content.submit}>
                  <Button
                    type="submit"
                    theme="primary"
                    size="medium"
                    classes="ml-15"
                    loading={props.mutateState?.isLoading}
                    disabled={props.mutateState?.isDisabled}
                  >
                    {props.content.submit}
                  </Button>
                </Show>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
