import { Component, JSXElement, Show } from "solid-js";
import classNames from "classnames";
// Components
import { PageHeadingProps } from "@/components/Groups/Layout/PageHeading";
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
  headingChildren?: JSXElement;
  options?: {
    noPadding?: boolean;
    noBorder?: boolean;
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
            noBorder: props.options?.noBorder,
          }}
        >
          {props.headingChildren}
        </Layout.PageHeading>
      </Show>
      <div
        class={classNames({
          "p-30 pb-[calc(var(--lucid-page-layout-footer-height)+30px)]":
            !props.options?.noPadding,
          "pb-[var(--lucid-page-layout-footer-height)] ":
            props.options?.noPadding,
        })}
      >
        <Layout.PageContent state={props.state}>
          {props.children}
        </Layout.PageContent>
      </div>
    </div>
  );
};
