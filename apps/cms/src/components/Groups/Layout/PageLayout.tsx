import T from "@/translations";
import {
  Component,
  JSXElement,
  Show,
  createMemo,
  Switch,
  Match,
} from "solid-js";
import classNames from "classnames";
// Assets
import notifySvg from "@/assets/illustrations/notify.svg";
// Components
import { PageHeadingProps } from "@/components/Groups/Layout/PageHeading";
import Layout from "@/components/Groups/Layout";
import Error from "@/components/Partials/Error";
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
  headingChildren?: JSXElement;
  options?: {
    noBorder?: boolean;
  };
}

export const PageLayout: Component<PageWrapperProps> = (props) => {
  // ----------------------------------------
  // Memos
  const showChildren = createMemo(() => {
    if (props.state?.isSuccess) return true;
    if (props.state === undefined) return true;
    return false;
  });

  // ----------------------------------------
  // Render
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
        class={classNames(
          "pb-[var(--lucid-page-layout-footer-height)] page-layout"
        )}
      >
        <Switch>
          <Match when={props.state?.isLoading}>
            <Loading type="page-layout" />
          </Match>
          <Match when={props.state?.isError}>
            <Error
              type="page-layout"
              content={{
                image: notifySvg,
                title: T("error_title"),
                description: T("error_message"),
              }}
            />
          </Match>
          <Match when={showChildren()}>{props.children}</Match>
        </Switch>
      </div>
    </div>
  );
};
