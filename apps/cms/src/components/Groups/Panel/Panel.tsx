import { Component, JSXElement, Show, onMount, createSignal } from "solid-js";
// Components
import { Dialog } from "@kobalte/core";

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
              <Dialog.Title>{props.content.title}</Dialog.Title>
              <Show when={props.content.description}>
                <Dialog.Description class="block mt-1">
                  {props.content.description}
                </Dialog.Description>
              </Show>
            </div>
            <div
              class="p-30"
              style={{
                "min-height": `calc(100vh - ${getBodyMinHeight()}px)`,
              }}
            >
              {props.children}
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
