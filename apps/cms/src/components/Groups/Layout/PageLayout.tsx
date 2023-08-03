import { Component, JSXElement, Switch, Match, Show } from "solid-js";
import classNames from "classnames";
// Components
import { PageHeadingProps } from "@/components/Groups/Layout/PageHeading";
import Loading from "@/components/Partials/Loading";
import Layout from "@/components/Groups/Layout";

interface PageWrapperProps {
  title?: string;
  description?: string;
  state?: {
    isLoading?: boolean;
    isError?: boolean;
    isSuccess?: boolean;
  };
  actions?: PageHeadingProps["actions"];
  children: JSXElement;
  options?: {
    noPadding?: boolean;
  };
}

export const PageLayout: Component<PageWrapperProps> = (props) => {
  return (
    <div class="min-h-screen w-full relative">
      <Show when={props.title}>
        <Layout.PageHeading
          title={props.title ?? ""}
          description={props.description}
          state={{
            isLoading: props.state?.isLoading,
          }}
          actions={props.actions}
          options={{
            noBorder: props.options?.noPadding,
          }}
        />
      </Show>
      <div
        class={classNames({
          "p-30 pb-[calc(var(--lucid-page-layout-footer-height)+30px)]":
            !props.options?.noPadding,
          "pb-[var(--lucid-page-layout-footer-height)]":
            props.options?.noPadding,
        })}
      >
        <Switch fallback={props.children}>
          <Match when={props.state?.isLoading}>
            <Loading type="page-layout" />
          </Match>
          <Match when={props.state?.isError}>
            <div>error</div>
          </Match>
          <Match when={props.state?.isSuccess}>{props.children}</Match>
        </Switch>
      </div>
    </div>
  );
};
