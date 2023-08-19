import T from "@/translations";
import {
  Component,
  JSXElement,
  Show,
  onMount,
  createSignal,
  Switch,
  Match,
} from "solid-js";
import { FaSolidArrowLeft } from "solid-icons/fa";
// Assets
import notifyIllustration from "@/assets/illustrations/notify.svg";
// Components
import { Dialog } from "@kobalte/core";
import Loading from "@/components/Partials/Loading";
import Error from "@/components/Partials/Error";

interface PanelProps {
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
  children: JSXElement;
  footer: JSXElement;
}

export const Panel: Component<PanelProps> = (props) => {
  // ------------------------------
  // State
  const [getBodyMinHeight, setBodyMinHeight] = createSignal(0);

  // ------------------------------
  // Refs
  let headerRef: HTMLDivElement | undefined = undefined;
  let footerRef: HTMLDivElement | undefined = undefined;

  // ------------------------------
  // Mount
  onMount(() => {
    setTimeout(() => {
      if (headerRef && footerRef) {
        setBodyMinHeight(headerRef.offsetHeight + footerRef.offsetHeight);
      }
    });
  });

  // ------------------------------
  // Render
  return (
    <Dialog.Root
      open={props.state.open}
      onOpenChange={() => props.state.setOpen(!props.state.open)}
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
                <Match when={props.state.isLoading}>
                  <div class="w-full">
                    <div class="h-8 skeleton w-1/4" />
                    <div class="h-6 skeleton w-full mt-2" />
                  </div>
                </Match>
                <Match when={!props.state.isLoading}>
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
              <Switch fallback={props.children}>
                <Match when={props.state.isLoading}>
                  <Loading type="fill" />
                </Match>
                <Match when={props.state.isError}>
                  <div class="min-h-[300px]">
                    <Error
                      type={"fill"}
                      content={{
                        image: notifyIllustration,
                        title: props.content.error || T("error_title"),
                        description: props.content.error
                          ? ""
                          : T("error_message"),
                      }}
                    />
                  </div>
                </Match>
              </Switch>
            </div>
            <Show when={props.footer !== undefined}>
              <div ref={footerRef} class="p-30 border-t">
                {props.footer}
              </div>
            </Show>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
