import T from "@/translations";
import { Component, JSXElement, Switch, Match } from "solid-js";
// Assets
import notifySvg from "@/assets/illustrations/notify.svg";
// Components
import Error from "@/components/Partials/Error";
import Loading from "@/components/Partials/Loading";

interface PageLayoutContentProps {
  state?: {
    isLoading?: boolean;
    isError?: boolean;
    isSuccess?: boolean;
  };
  children: JSXElement;
}

export const PageContent: Component<PageLayoutContentProps> = (props) => {
  // ----------------------------------------
  // Render
  return (
    <Switch fallback={props.children}>
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
      <Match when={props.state?.isSuccess}>{props.children}</Match>
    </Switch>
  );
};
