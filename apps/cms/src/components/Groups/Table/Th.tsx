import classNames from "classnames";
import { Component, JSXElement, Switch, Match } from "solid-js";

interface ThProps {
  options?: {
    include?: boolean;
    width?: number;
    sortable?: boolean;
  };
  data?: {
    key?: string;
    index?: number;
  };
  content?: {
    icon?: JSXElement;
    label?: string;
  };
  callbacks?: {};
  children?: JSXElement;
}

export const Th: Component<ThProps> = (props) => {
  return (
    <th
      class={classNames("text-left", {
        hidden: props.options?.include === false,
      })}
      style={{
        width: props.options?.width ? `${props.options.width}px` : undefined,
      }}
    >
      <Switch>
        <Match when={props.content?.label !== undefined}>
          {props.content?.label}
        </Match>
        <Match when={props.children !== undefined}>{props.children}</Match>
      </Switch>
    </th>
  );
};
