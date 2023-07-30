import { Component, JSXElement, Switch, Match } from "solid-js";
// Components
import PageHeading from "@/components/Blocks/PageHeading";
import Loading from "@/components/Partials/Loading";

interface PageWrapperProps {
  title: string;
  description?: string;
  state?: {
    isLoading?: boolean;
    isError?: boolean;
    isSuccess?: boolean;
  };
  children: JSXElement;
}

const PageLayout: Component<PageWrapperProps> = (props) => {
  return (
    <div class="min-h-screen w-full relative">
      <PageHeading
        title={props.title}
        description={props.description}
        state={{
          isLoading: props.state?.isLoading,
        }}
      />
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
