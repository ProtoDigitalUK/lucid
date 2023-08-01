import { Component, onMount, Switch, Match, Show } from "solid-js";
import { FaSolidTrash } from "solid-icons/fa";
// Components
import Button from "@/components/Partials/Button";

export interface PageHeadingProps {
  title: string;
  description?: string;
  state?: {
    isLoading?: boolean;
  };
  actions?: {
    delete?: {
      open: boolean;
      setOpen: (open: boolean) => void;
    };
  };
}

const PageHeading: Component<PageHeadingProps> = (props) => {
  let headerEle: HTMLElement | undefined;

  // ----------------------------------------
  // Functions
  function setHeaderHeight() {
    if (headerEle) {
      document.documentElement.style.setProperty(
        "--lucid_page-layout-header-height",
        `${headerEle.offsetHeight}px`
      );
    }
  }

  // ----------------------------------------
  // Mount
  onMount(() => {
    setHeaderHeight();
    window.addEventListener("resize", setHeaderHeight);

    const observer = new MutationObserver(setHeaderHeight);
    observer.observe(headerEle!, { attributes: true, childList: true });

    return () => {
      window.removeEventListener("resize", setHeaderHeight);
      observer.disconnect();
    };
  });

  // ----------------------------------------
  // Render
  return (
    <header
      ref={headerEle}
      class="p-30 border-b border-border flex justify-between items-start"
    >
      {/* Textarea */}
      <div class="max-w-3xl">
        <Switch>
          <Match when={props.state?.isLoading}>
            <div class="animate-pulse">
              <div class="h-10 bg-backgroundAccent rounded-md w-1/4"></div>
              <div class="h-4 bg-backgroundAccent rounded-md w-full mt-2"></div>
              <div class="h-4 bg-backgroundAccent rounded-md w-full mt-2"></div>
            </div>
          </Match>
          <Match when={!props.state?.isLoading}>
            <h1>{props.title}</h1>
            <Show when={props.description}>
              <p class="mt-2">{props.description}</p>
            </Show>
          </Match>
        </Switch>
      </div>
      {/* Actions */}
      <Show when={props.actions}>
        <div class="flex items-center justify-end ml-5">
          <Show when={props.actions?.delete !== undefined}>
            <Button
              theme="danger"
              size="icon"
              type="button"
              onClick={() => props.actions?.delete?.setOpen(true)}
            >
              <span class="sr-only">Delete</span>
              <FaSolidTrash />
            </Button>
          </Show>
        </div>
      </Show>
    </header>
  );
};

export default PageHeading;
