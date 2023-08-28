import { Component, JSXElement, Switch, Match, Show } from "solid-js";
// Components
import Layout from "@/components/Groups/Layout";
import Button from "@/components/Partials/Button";
import ErrorMessage from "@/components/Partials/ErrorMessage";
// Types
import { APIErrorResponse } from "@/types/api";

interface FormProps {
  type: "standard" | "page-layout";
  state: {
    isLoading: boolean;
    isDisabled?: boolean;
    errors: APIErrorResponse | undefined;
  };
  content: {
    submit: string;
  };
  permission?: boolean;
  onSubmit?: () => void;
  children: JSXElement;
}

export const Form: Component<FormProps> = (props) => {
  // ----------------------------------------
  // Render
  return (
    <form
      class="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        if (props.onSubmit) props.onSubmit();
      }}
    >
      {props.children}
      <Switch>
        {/* Standard Submit */}
        <Match when={props.type === "standard"}>
          <div class="mt-10 w-full">
            <Show when={props.state.errors && props.state.errors?.message}>
              <ErrorMessage
                theme="container"
                message={props.state.errors?.message}
              />
            </Show>

            <Button
              size="medium"
              classes="w-full"
              type="submit"
              theme="primary"
              loading={props.state.isLoading}
              disabled={props.state.isDisabled}
              permission={props.permission}
            >
              {props.content.submit}
            </Button>
          </div>
        </Match>
        {/* Page Layout Submit */}
        <Match when={props.type === "page-layout"}>
          <Layout.PageFooter>
            <Show when={props.state.errors && props.state.errors?.message}>
              <ErrorMessage
                theme="background"
                message={props.state.errors?.message}
              />
            </Show>
            <Button
              type="submit"
              theme="primary"
              size="medium"
              loading={props.state.isLoading}
              disabled={props.state.isDisabled}
              permission={props.permission}
            >
              {props.content.submit}
            </Button>
          </Layout.PageFooter>
        </Match>
      </Switch>
    </form>
  );
};
