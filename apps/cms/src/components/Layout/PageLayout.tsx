import { Component, JSXElement, Switch, Match, Show } from "solid-js";
// Components
import PageHeading, { PageHeadingProps } from "@/components/Layout/PageHeading";
import Loading from "@/components/Partials/Loading";

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
}

const PageLayout: Component<PageWrapperProps> = (props) => {
  return (
    <div class="min-h-screen w-full relative">
      <Show when={props.title}>
        <PageHeading
          title={props.title ?? ""}
          description={props.description}
          state={{
            isLoading: props.state?.isLoading,
          }}
          actions={props.actions}
        />
      </Show>
      <div
        class="p-30"
        style={{
          "padding-bottom":
            "calc(var(--lucid_page-layout-footer-height) + 30px)",
        }}
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

export default PageLayout;
