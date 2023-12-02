import T from "@/translations";
import { Component, onMount, Switch, Match, Show, JSXElement } from "solid-js";
import { FaSolidPlus, FaSolidTrash } from "solid-icons/fa";
import classNames from "classnames";
// Components
import Button from "@/components/Partials/Button";
import ContentLanguageSelect from "@/components/Partials/ContentLanguageSelect";

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
      label?: string;
    };
    contentLanguage?: boolean;
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
        "--headless-page-layout-header-height",
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
      <div
        class={
          "p-15 md:p-30 flex md:justify-between md:flex-row flex-col-reverse items-start"
        }
      >
        {/* Textarea */}
        <div class="max-w-4xl w-full">
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
          <div class="flex items-center justify-end md:ml-5 mb-5 md:mb-0 w-full">
            <Show
              when={
                props.actions?.contentLanguage !== undefined &&
                props.actions.contentLanguage !== false
              }
            >
              <div class="w-full md:max-w-[240px] mr-2.5">
                <ContentLanguageSelect />
              </div>
            </Show>
            <Show
              when={
                props.actions?.create !== undefined &&
                props.actions.create.permission !== false
              }
            >
              <Button
                type="submit"
                theme="primary"
                size="icon"
                onClick={() => {
                  props.actions?.create?.setOpen(true);
                }}
              >
                <FaSolidPlus />
                <span class="sr-only">
                  {props.actions?.create?.label ?? T("create")}
                </span>
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
