import T from "@/translations";
import { Component, onMount, Switch, Match, Show, JSXElement } from "solid-js";
import { FaSolidTrash } from "solid-icons/fa";
// Components
import Button from "@/components/Partials/Button";
import classNames from "classnames";

export interface PageHeadingProps {
  title: string;
  description?: string;
  children?: JSXElement;
  state?: {
    isLoading?: boolean;
  };
  actions?: {
    delete?: {
      open: boolean;
      setOpen: (_open: boolean) => void;
      permission?: boolean;
    };
    create?: {
      open: boolean;
      setOpen: (_open: boolean) => void;
      permission?: boolean;
    };
  };
  options?: {
    noBorder?: boolean;
  };
}

export const PageHeading: Component<PageHeadingProps> = (props) => {
  let headerEle: HTMLElement | undefined;

  // ----------------------------------------
  // Functions
  function setHeaderHeight() {
    if (headerEle) {
      document.documentElement.style.setProperty(
        "--lucid-page-layout-header-height",
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
      class={classNames("border-border ", {
        "border-b": !props.options?.noBorder,
      })}
    >
      <div class={"p-15 md:p-30 flex justify-between items-start"}>
        {/* Textarea */}
        <div class="max-w-3xl w-full">
          <Switch>
            <Match when={props.state?.isLoading}>
              <div class="w-full">
                <div class="h-10 skeleton w-1/4" />
                <div class="h-4 skeleton w-full mt-2" />
                <div class="h-4 skeleton w-full mt-2" />
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
            <Show
              when={
                props.actions?.create !== undefined &&
                props.actions.create.permission !== false
              }
            >
              <Button
                type="submit"
                theme="primary"
                size="medium"
                onClick={() => {
                  props.actions?.create?.setOpen(true);
                }}
              >
                {T("create")}
              </Button>
            </Show>
            <Show
              when={
                props.actions?.delete !== undefined &&
                props.actions.delete.permission !== false
              }
            >
              <Button
                theme="danger"
                size="icon"
                type="button"
                onClick={() => props.actions?.delete?.setOpen(true)}
              >
                <span class="sr-only">{T("delete")}</span>
                <FaSolidTrash />
              </Button>
            </Show>
          </div>
        </Show>
      </div>

      <div class="w-full">{props.children}</div>
    </header>
  );
};
